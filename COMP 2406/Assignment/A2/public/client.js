var pen = {
    currX: 0,
    currY: 0,
    prevX: 0,
    prevY: 0,
    color: "black",
    size: 2,
}; //location where mouse is pressed

var drawing = false;
var bound = false;
var canvas, ctx;
var gamemaster = false;
var gameOver = false;

$(document).ready(function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = 450;
    canvas.height = 400;
    $(".gamemaster").hide();
    const userName = prompt("What's your name?") || "User";
    const socket = io(); //connect to the server that sent this page

    //This is called after the broswer has loaded the web page
    //add mouse down listener to our canvas object
    $("#canvas1").mousedown(handleMouseDown);
    //add key handler for the document as a whole, not separate elements.

    socket.on("connect", function() {
        socket.emit("intro", JSON.stringify(userName));
        console.log("you are: " + userName + ", with ID: " + socket.id);
    });

    $('#sizeSlider').on('change', function() {
        pen.size = $(this).val();
        console.log($(this).val());
        $('#chanceSlider').val($('#chance').val());
    });

    $("#inputText").keypress(function(ev) {
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

    $("#becomeGM").click(function() {
        socket.emit("gamemaster");
    });

    $("#resignGM").click(function() {
        socket.emit("resign");
        if (!gamemaster) {
            $(".gamemaster").hide();
        }
    });

    $("#secret").keypress(function(ev) {
        if (ev.which === 13) {
            if ($(this).val() == "") {
                $("#chatLog").append("$You have not entered a word");
                $("#chatLog")[0].scrollTop = $("#chatLog")[0].scrollHeight;
            } else {
                socket.emit("submitAnswer", JSON.stringify($(this).val()));
                $(this).val("");
                $("#secret").hide();
            }
        }
    });

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

    socket.on("clearBoard", function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("gamemasterState", function(data) {
        gamemaster = JSON.parse(data);
        if (gamemaster) {
            $(".gamemaster").show();
        } else {
            $(".gamemaster").hide();
        }
    });


    socket.on("timer", function(data) {
        var timeState = JSON.parse(data);
        if (timeState == false) {
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

    socket.on("draw", function(data) {
        var line = JSON.parse(data);
        ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(line.prevX, line.prevY);
        ctx.lineTo(line.currX, line.currY);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        ctx.stroke();
        ctx.closePath();
    });

    socket.on("message", function(data) {
        var message = JSON.parse(data);
        $("#chatLog").append(message + "\n");
        $("#chatLog")[0].scrollTop = $("#chatLog")[0].scrollHeight; //scroll to the bottom
    });

    socket.on("userList", function(data) {
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

    function draw() {
        ctx = canvas.getContext("2d");
        socket.emit("draw", JSON.stringify(pen));
    }

    function scrollToBottom() {
        $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
    }
});
