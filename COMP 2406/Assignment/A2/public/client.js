var pen = {
    currX: 0,
    currY: 0,
    prevX: 0,
    prevY: 0,
    color: "black",
    size: 2,
}; //pen data

var drawing = false;    //is the mouse drawing?
var bound = false;      //is the mouse bound on the screen?
var canvas, ctx;        //the canvas and it's context
var gamemaster = false; //value if the player is the current drawer
var gameOver = false;   //determines whether or not the game is in progress

$(document).ready(function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = 450;
    canvas.height = 400;
    $(".gamemaster").hide();
    const userName = prompt("What's your name?") || "User";
    const socket = io(); //connect to the server that sent this page

    //add mouse down listener to our canvas object
    $("#canvas1").mousedown(handleMouseDown);
    socket.on("connect", function() {//on first connect, introduce yourself to the server
        socket.emit("intro", JSON.stringify(userName));
    });

    $('#sizeSlider').on('change', function() { //input range to determine the size of the pen on the canvas
        pen.size = $(this).val();
        console.log($(this).val());
        $('#chanceSlider').val($('#chance').val());
    });

    $("#inputText").keypress(function(ev) { //listener to send messages to the chatLog
        if (ev.which === 13) {
            if ($(this).val() != "") {
                //send message
                socket.emit("message", JSON.stringify($(this).val()));
                ev.preventDefault(); //if any
                $("#chatLog").append((new Date()).toLocaleTimeString() + ", " + userName + ": " + $(this).val() + "\n");
                $("#chatLog")[0].scrollTop = $("#chatLog")[0].scrollHeight;
                $(this).val(""); //empty the input
            }
        }
    });

    $("#becomeGM").click(function() {   //Draw button listener
        socket.emit("gamemaster");
    });

    $("#resignGM").click(function() {   //Resign button listener
        socket.emit("resign");
        if (!gamemaster) {
            $(".gamemaster").hide();
        }
    });

    $("#secret").keypress(function(ev) {    //Area to enter the word for the players to guess
        if (ev.which === 13) {              //this is only visible to the game master
            if ($(this).val() == "") {      //the game master cannot edit the word through a session
                $("#chatLog").append("$You have not entered a word");
                $("#chatLog")[0].scrollTop = $("#chatLog")[0].scrollHeight;
            } else {
                socket.emit("submitAnswer", JSON.stringify($(this).val())); //this socket starts the game
                $(this).val("");
                $("#secret").hide();
            }
        }
    });

    //listeners for the pens colour
    $("#black").click(function() {
        pen.color = "black";
    });

    $("#red").click(function() {
        pen.color = "red";
    });

    $("#blue").click(function() {
        pen.color = "blue";
    });

    $("#green").click(function() {
        pen.color = "green";
    });

    $("#orange").click(function() {
        pen.color = "orange";
    });

    $("#yellow").click(function() {
        pen.color = "yellow";
    });

    $("#white").click(function() {
        pen.color = "white";
    });

    $("#clearAll").click(function() {
        socket.emit("clearBoard");
    });

    //clear board function
    socket.on("clearBoard", function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("gamemasterState", function(data) {   //this will be called by the server to let a user know he is a gamemaster
        gamemaster = JSON.parse(data);              //only a game master will see the drawing controls
        if (gamemaster) {                           //this socket will also be called by the server to hide the controls and effectively demote the gamemaster
            $(".gamemaster").show();
        } else {
            $(".gamemaster").hide();
        }
    });

    socket.on("timer", function(data) {     //the timer controls the pace of the game
        var timeState = JSON.parse(data);   //timer starts when an answer was submitted by the gamemaster
        if (timeState == false) {           //timer ends when a solution was found, the game master resigned, or the timer ran out
            gameOver = true;
            if (gamemaster){
                $("#secret").show();
            }
        } else if (timeState == true) {
            var seconds = 60;
            var x = setInterval(function(){
                $("#timer").html(seconds);
                seconds = seconds - 1;
                if (seconds < 0 || gameOver) {
                    clearInterval(x);
                    if (gamemaster){
                        $("#secret").show();
                    }
                    gameOver=false;
                }
            }, 1000);
        }
    });

    socket.on("draw", function(data) {  //the server sends all draw sockets
        var line = JSON.parse(data);    //the server can receive draw sockets but will only emit those of the current GM
        ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(line.prevX, line.prevY);
        ctx.lineTo(line.currX, line.currY);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        ctx.stroke();
        ctx.closePath();
    });

    socket.on("message", function(data) {   //socket to recieve messages from
        var message = JSON.parse(data);
        $("#chatLog").append(message + "\n");
        $("#chatLog")[0].scrollTop = $("#chatLog")[0].scrollHeight; //scroll to the bottom
    });

    socket.on("userList", function(data) {  //socket to recieve userlist from
        $("#userList").empty(); //empty list for ease of update
        var currUsers = JSON.parse(data);
        currUsers.forEach(function(user) { //simple for loop -> go through each user with socket
            const element = $('<li>' + user + '</li>'); // create list item

            $("#userList").append(element); //then add list item
        });
    });

    function handleMouseDown(e) {
        pen.prevX = pen.currX;
        pen.prevY = pen.currY;
        pen.currX = e.clientX - canvas.offsetLeft;
        pen.currY = e.clientY - canvas.offsetTop;
        drawing = true;
        bound = true;

        $("#canvas1").mousemove(handleMouseMove);
        $("#canvas1").mouseup(handleMouseUp);
        // Stop propagation of the event and stop any default
        //  browser action
        e.stopPropagation();
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (bound) {
            pen.prevX = pen.currX;
            pen.prevY = pen.currY;
            pen.currX = e.clientX - canvas.offsetLeft;
            pen.currY = e.clientY - canvas.offsetTop;
            draw();
        }
        e.stopPropagation();
    }

    function handleMouseUp(e) {
        //get mouse location relative to canvas top left
        bound = false;
        e.stopPropagation();
        //remove mouse move and mouse up handlers but leave mouse down handler
        $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
        $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler
    }

    function draw() {   //send pen data
        ctx = canvas.getContext("2d");
        socket.emit("draw", JSON.stringify(pen));
    }

    function scrollToBottom() { //scroll to the bottom of the text area
        $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
    }
});
