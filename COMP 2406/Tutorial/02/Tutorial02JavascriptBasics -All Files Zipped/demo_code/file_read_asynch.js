/*
Example of ASYNCHRONOUS file read.
Function readFile does not block (wait) for the file to be read.

Instead its argument function(err,data) will be called once the file has been read.
function(err,data) is the "call back" function that will be called when readFile's task is done.
*/

var colour = require('colour');
var fs = require('fs');
fs.readFile('songs/sister_golden_hair.txt', function(err, data) {
    if (err) throw err;
    let chords = "";
    let verses = "";
    let delay = 0;
    var array = data.toString().split("\n");

    for (i in array) {
        for (let k = 0; k < array[i].length - 1; k++) {
            if (array[i].charAt(k) == "[") {
                k++;
                while (array[i].charAt(k) != "]") {
                    chords += (array[i].charAt(k));
                    delay++;
                    k++;
                }
                chords += " ";
                delay++;
            } else {
                if ((delay) > 0) {
                    verses += (array[i].charAt(k));
                    delay--;
                } else {
                    chords += " ";
                    verses += (array[i].charAt(k));
                }

            }
        }
        console.log(chords.green);
        console.log(verses.yellow);
        chords = "";
        verses = "";
    }
});
console.log("DONE");
