var song = [];
var title = "";
var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

//KEY CODES
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

var sortSong = function() {
    console.log("adding coordinates to each word");
    var canvasTmp = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "18px Arial";
    var x = 10;
    var y = 35;

    for (i in song) {
        song[i].stringWidth = ctx.measureText(song[i].word).width;
        if (x + song[i].stringWidth > canvas.width || song[i].word.search(/\n/) != -1) { //if Adding a word to the canvas exceeds its size, new line!
            console.log("NEW LINE!");
            x = 10;
            y += 60;
        }

        if (song[i].isChord) {
            if (song[i - 1].isChord) {
                song[i].y = y - 30;
                song[i].x = x + (song[i - 1].stringWidth + 10);
                console.log("Chord " + song[i].word + " updated to " + song[i].x + ", " + song[i].y);
            } else if (song[i - 2].isChord) {
                song[i].y = y - 30;
                song[i].x = x + (song[i - 2].stringWidth) - 15;
                console.log("Chord " + song[i].word + " updated to " + song[i].x + ", " + song[i].y);
            } else {
                song[i].y = y - 30;
                song[i].x = x;
                console.log("Chord " + song[i].word + " updated to " + song[i].x + ", " + song[i].y);
            }
        } else {
            song[i].x = x;
            song[i].y = y;
            console.log("Word " + song[i].word + " updated to " + song[i].x + ", " + song[i].y);
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

function handleSortSong(){
    sortSong();
    drawCanvas();
}

function handlePostSong() {
    if (song.length > 0) {

        var userRequestObj = {
            title: title,
            song: song
        }; //make object to send to server

        console.log(userRequestObj.song);
        var userRequestJSON = JSON.stringify(userRequestObj); //make json string
        $.post("saveSong", userRequestJSON, function(data, status) {
            console.log("data: " + data);
            console.log("typeof: " + typeof data);
            if (data) {
                alert(title + " was saved with this word layout!");
                console.log(data);
            }
        });
    }
}


function handleSubmitButton() {

    var userText = $('#userTextField').val(); //get text from user text input field
    if (userText && userText != '') {
        title = userText;
        //user text was not empty
        var userRequestObj = ({
            text: userText
        }); //make object to send to server
        var userRequestJSON = JSON.stringify(userRequestObj);
        $('#userTextField').val(''); //clear the user text field
        song = [];

        $.post("userText", userRequestJSON, function(data, status) {
            var textField = document.getElementById("userTextField");
            var responseObj = JSON.parse(data);
            try { //The file has been processed in the past and should only be loaded into "var song"
                song = JSON.parse(responseObj.lyric);
                textField.style.backgroundColor = "white";
                drawCanvas();

            } catch (err) { //the file needs to be processed into objects the canvas can use
                if (responseObj.found) {
                    textField.style.backgroundColor = "white";
                    var array = responseObj.lyric.toString().split(/ /);
                    var pos;
                    var tempArr = [];

                    for (var k = 0; k < array.length; k++) {
                        tempArr = [];
                        if (array[k].search(/\n|\r/) != -1) {
                            tempArr = array[k].split(/\n|\r/);

                            if (tempArr.length > 0) {
                                for (var i = tempArr.length; i >= 0; i--) {
                                    array.splice(k, 0, tempArr[i]);
                                }
                                k += tempArr.length;
                                console.log(array[k]);
                                array.splice(k, 2, "");
                                array.splice(k-1, 0, "\n");
                            }
                        }
                    }
                    array = array.filter(Boolean); //removes all the falsy items since splice() is bugged
                    console.log(array);

                    for (k in array) {
                        pos = array[k].search(/\[/);
                        if (pos != -1) { //there is a chord in this word
                            var chord = "";
                            var verse = "";
                            for (var n = 0; n < array[k].length; n++) {
                                if (n == pos) {
                                    while (array[k].charAt(n) != "]") {
                                        chord += array[k].charAt(n);
                                        n++;
                                    }
                                    chord += "]";
                                } else {
                                    verse += array[k].charAt(n);
                                }
                            }
                            if (chord != "") {
                                song.push({
                                    word: chord,
                                    isChord: true,
                                    stringWidth: 10,
                                    x: 0,
                                    y: 50,
                                });
                            }
                            if (verse != "") {
                                song.push({
                                    word: verse,
                                    isChord: false,
                                    stringWidth: 10,
                                    x: 0,
                                    y: 50,
                                });
                            }
                            console.log("Pushed: " + verse + " " + chord);
                        } else { //the word is not a chord
                            song.push({
                                word: array[k],
                                isChord: false,
                                stringWidth: 10,
                                x: 0,
                                y: 50,
                            });
                            console.log("Pushed: " + array[k]);
                        }
                    }
                    console.log("words have been added to song array");
                    sortSong();
                    drawCanvas();
                } else {
                    textField.value = "Song not found";
                    textField.style.backgroundColor = "red";
                }
            }
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
