
/*
Example of ASYNCHRONOUS file read.
Function readFile does not block (wait) for the file to be read.

Instead its argument function(err,data) will be called once the file has been read.
function(err,data) is the "call back" function that will be called when readFile's task is done.
*/


var fs = require('fs');
var colour = require("colour");
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(">>Please enter a song name (EX: sister_golden_hair): ", function(answer) {
   fs.readFile('songs/' + answer + '.txt', function(err, data) {
     if(err) throw err;
     var array = data.toString().split("\n");
     var chordArr = "";
     var lyrics = "";
     var chords = 0;
     var i, j;
     var spaces = 0;
     for(i = 0; i < array.length; i++){ //Reads each line seperately
       lyrics += " ";
       for(j = 0; j < array[i].length; j++){ //Reads each char seperately
         if(array[i].charAt(j) == '\r' || array[i].charAt(j) == '\n'){
           chordArr += "\n";
           lyrics += "\n";
         }
         else if(array[i].charAt(j) == '['){
           var x = j+1; //x represents where the chord starts
           while(array[i].charAt(x) != ']'){
             chordArr += array[i].charAt(x);
             x++;
             spaces++;
           }
           j = x;
           chords++;
         }
         else{
           if(spaces > 0){
             lyrics += array[i].charAt(j);
             spaces--;
           }
           else{
             chordArr += " ";
             lyrics += array[i].charAt(j);
           }
         }
       }
     }
     lyricsArr = lyrics.split("\n");
     chordArray = chordArr.split("\n");
     for(index = 0; index < lyricsArr.length; index++){
       console.log(chordArray[index].green);
       console.log(lyricsArr[index].yellow);
     }
     console.log("Number of chords found: " + chords);
     console.log("Number of lines found: " + array.length);
   });
   rl.close();
});
