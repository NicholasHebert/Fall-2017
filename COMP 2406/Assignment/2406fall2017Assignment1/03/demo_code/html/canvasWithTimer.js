var song = [];
var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

//KEY CODES
//should clean up these hard coded key codes
var ENTER = 13;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var DOWN_ARROW = 40;

function getWordAtLocation(aCanvasX, aCanvasY) {

    for (var i = 0; i < song.length; i++) {
        if (Math.abs(song[i].x + song[i].stringWidth) > aCanvasX && Math.abs(song[i].x < aCanvasX)) {
            if (Math.abs(song[i].y - aCanvasY) < 20) {
                return song[i];
            }
        }
    }
    return null;
}
/*
var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
ctx.font = "11px Arial";
var width = ctx.measureText(str).width;
*/
var compileSong = function() {
    console.log("adding coordinates to each word");
    var canvasTmp = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "18px Arial";
    var x = 10;
    var y = 35;

    for (i in song) {
        song[i].stringWidth = ctx.measureText(song[i].word).width;
        if (x + song[i].stringWidth > canvas.width || song[i].word.search(":") != -1 || song[i].word === ("")) {
            console.log("NEW LINE!");
            x = 10;
            y += 60;
        }

        //determine whether or not the given word is a chord
        //if the chord is a string determine if the entire word is a chord or is the chord burried within a word
        if (song[i].word.search(/\[/) != -1) {
            if (song[i].word.charAt(0) == "[") {
                song[i].isChord = true;
            } else {
                var eChord = "";
                var nVerse = "";
                for (k in song[i].word) {
                    if (song[i].word.charAt(k) == "[") {
                        while (song[i].word.charAt(k) != "]") {
                            eChord += song[i].word.charAt(k)
                            song[i].word.replace(/[*]/, "");
                            k++;
                        }
                    } else {
                        nVerse += song[i].word.charAt(k);
                    }
                }
                song[i].word = nVerse;
                song.splice(i, 0, eChord);
                song.join();
                song[i].isChord = true;
            }
        }

        if (song[i].isChord) {
            song[i].y = y - 30;
            song[i].x = x;
        } else {
            song[i].x = x;
            song[i].y = y;
            x += (song[i].stringWidth + 7);
        }
    }
    console.log("finished adding coordinates");
}

var drawCanvas = function() {
    console.log("we drawin");
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

    context.font = '18px Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    for (var i = 0; i < song.length; i++) { //note i declared as var
        context.fillText(song[i].word, song[i].x, song[i].y);
    }
    context.stroke();
}

function handleMouseDown(e) {

    //get mouse location relative to canvas top left
    var rect = canvas.getBoundingClientRect();
    //var canvasX = e.clientX - rect.left;
    //var canvasY = e.clientY - rect.top;
    var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
    var canvasY = e.pageY - rect.top;
    console.log("mouse down:" + canvasX + ", " + canvasY);

    wordBeingMoved = getWordAtLocation(canvasX, canvasY);
    //console.log(wordBeingMoved.word);
    if (wordBeingMoved != null) {
        deltaX = wordBeingMoved.x - canvasX;
        deltaY = wordBeingMoved.y - canvasY;
        //document.addEventListener("mousemove", handleMouseMove, true);
        //document.addEventListener("mouseup", handleMouseUp, true);
        $("#canvas1").mousemove(handleMouseMove);
        $("#canvas1").mouseup(handleMouseUp);

    }

    // Stop propagation of the event and stop any default
    //  browser action

    e.stopPropagation();
    e.preventDefault();

    drawCanvas();
}

function handleMouseMove(e) {

    //console.log("mouse move");

    //get mouse location relative to canvas top left
    var rect = canvas.getBoundingClientRect();
    var canvasX = e.pageX - rect.left;
    var canvasY = e.pageY - rect.top;

    wordBeingMoved.x = canvasX + deltaX;
    wordBeingMoved.y = canvasY + deltaY;

    e.stopPropagation();

    drawCanvas();
}

function handleMouseUp(e) {
    //console.log("mouse up");

    e.stopPropagation();

    //$("#canvas1").off(); //remove all event handlers from canvas
    //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

    //remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

    drawCanvas(); //redraw the canvas
}


function handleKeyDown(e) {

    //console.log("keydown code = " + e.which)
    var keyCode = e.which;
    if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
        //prevent browser from using these with text input drop downs
        e.stopPropagation();
        e.preventDefault();
    }

}

function handleKeyUp(e) {
    //console.log("key UP: " + e.which);

    if (e.which == ENTER) {
        handleSubmitButton(); //treat ENTER key like you would a submit
        $('#userTextField').val(''); //clear the user text field
    }

    e.stopPropagation();
    e.preventDefault();

}

function handleSubmitButton() {

    var userText = $('#userTextField').val(); //get text from user text input field
    if (userText && userText != '') {
        //user text was not empty
        var userRequestObj = {
            text: userText
        }; //make object to send to server
        var userRequestJSON = JSON.stringify(userRequestObj); //make json string
        $('#userTextField').val(''); //clear the user text field

        //Prepare a POST message for the server and a call back function
        //to catch the server repsonse.
        //alert ("You typed: " + userText);
        $.post("userText", userRequestJSON, function(data, status) {
            console.log("data: " + data);
            console.log("typeof: " + typeof data);
            var responseObj = JSON.parse(data);
            if (responseObj.found) {
                var array = responseObj.lyric.toString().replace(/\n/g, " ").split(" ");
            }
            for (i in array) {
                song.push({
                    word: array[i],
                    isChord: false,
                    stringWidth: 10,
                    x: 0,
                    y: 50,
                });
            }
            console.log("words have been added to song array")
            compileSong();
            drawCanvas();
        });
    }
}


$(document).ready(function() {
    //This is called after the broswer has loaded the web page

    //add mouse down listener to our canvas object
    $("#canvas1").mousedown(handleMouseDown);

    //add key handler for the document as a whole, not separate elements.
    $(document).keydown(handleKeyDown);
    $(document).keyup(handleKeyUp);

    drawCanvas();
});
