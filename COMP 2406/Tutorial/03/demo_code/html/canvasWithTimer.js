/*
Javasript to handle mouse dragging and release
to drag a string around the html canvas
Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM element is just the canvas on which
where are drawing and a text field and button where the user can type data

This example shows examples of using JQuery
JQuery is a popular helper library the has useful methods,
especially for sendings asynchronous requests to the server
and catching the response.

See the W3 Schools website to learn basic JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//Use javascript array of objects to represent words and their locations
var song = [];
let chords = [];
let verses = [];
var timer;

var wordBeingMoved;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {

    //locate the word near aCanvasX,aCanvasY
    //Just use crude region for now.
    //should be improved to using lenght of word etc.

    //note you will have to click near the start of the word
    //as it is implemented now
    for (var i = 0; i < words.length; i++) {
        if (Math.abs(words[i].x + words[i].stringWidth) > aCanvasX && Math.abs(words[i].x < aCanvasX)) {
            if (Math.abs(words[i].y - aCanvasY) < 20) {
                return words[i];
            }
        }
    }
    return null;
}

var compileSong = function() {
        for (var i = 0; i <verses.length; i++){
            song[i*2] = chords[i];
            song[(i*2)+1] = verses[i];
        }
}


var drawCanvas = function() {
    compileSong();
    var context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

    context.font = '20pt Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    for (var i = 0; i < words.length; i++) { //note i declared as var

        var data = words[i];
        song[i].stringWidth = context.measureText(words[i].word).width;
        sing[i].stringHeight = 100;
        context.fillText(data.word, data.x, data.y);
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

    console.log("mouse move");

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
    console.log("mouse up");

    e.stopPropagation();

    //$("#canvas1").off(); //remove all event handlers from canvas
    //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

    //remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

    drawCanvas(); //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer() {
    movingString.x = (movingString.x + 5 * movingString.xDirection);
    movingString.y = (movingString.y + 5 * movingString.yDirection);

    //keep inbounds of canvas
    if (movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1;
    if (movingString.x < 0) movingString.xDirection = 1;
    if (movingString.y > canvas.height) movingString.yDirection = -1;
    if (movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1;

    drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
var ENTER = 13;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var DOWN_ARROW = 40;


function handleKeyDown(e) {

    console.log("keydown code = " + e.which);

    var keyCode = e.which;
    if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
        //prevent browser from using these with text input drop downs
        e.stopPropagation();
        e.preventDefault();
    }

}

function handleKeyUp(e) {
    console.log("key UP: " + e.which);

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
                    var array = data.toString().split("\n");
                    //replace word array with new words if there are any

                    let delay = 0;
                    var array = data.toString().split("\n");

                    for (i in array) {
                        for (let k = 0; k < array[i].length - 1; k++) {
                            if (array[i].charAt(k) == "[") {
                                k++;
                                while (array[i].charAt(k) != "]") {
                                    chords[i] += (array[i].charAt(k));
                                    delay++;
                                    k++;
                                }
                                chords[i] += " ";
                                delay++;
                            } else {
                                if ((delay) > 0) {
                                    verses[i] += (array[i].charAt(k));
                                    delay--;
                                } else {
                                    chords[i] += " ";
                                    verses[i] += (array[i].charAt(k));
                                }
                            }
                        }
                    }
                });
        }
    }
}


$(document).ready(function() {
    //This is called after the broswer has loaded the web page

    //add mouse down listener to our canvas object
    $("#canvas1").mousedown(handleMouseDown);

    //add key handler for the document as a whole, not separate elements.
    $(document).keydown(handleKeyDown);
    $(document).keyup(handleKeyUp);

    timer = setInterval(handleTimer, 100);
    //timer.clearInterval(); //to stop

    drawCanvas();
});
