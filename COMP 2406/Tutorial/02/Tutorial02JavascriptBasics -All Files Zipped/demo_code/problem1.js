/* Example of javascript functions

Example adapted from:
 "Elequent Javascript" 2nd ed. by Marijn Haverbeke
http://eloquentjavascript.net/03_functions.html


Exercise 1:

Modify the code given below so that the hill function makes use of the
underscore character, just like the flat function does,
expect the mountain tops will have to be drawn on the previous line of the output.

Also modify the code so that the following script portion will
result in the terrain shown.

  //BUILD SCRIPT
  flat(3)
  hill(5);
  flat(2);
  hill(3);
  flat(4);
  hill(0);
  flat(2);
  //END SCRIPT


function and the program produces the following terrain.

    _____    ___
___/     \__/   \____/\__


Exercise 2:

Modify the code from exercise 1 so you can have both hills and mountains.
Mountains are require two output lines.

After completing exercise 2 the following BUILD SCRIPT portion should produce the output shown.

  //BUILD SCRIPT
  flat(3)
  mountain(3);
  flat(2);
  mountain(0);
  flat(4);
  hill(1);
  flat(1);
  //END SCRIPT


function and the program produces the following terrain.

     ___
    /   \    /\      _
___/     \__/  \____/ \_


*/


let landscape = function() {
    let sky2 = "";
    let sky1 = "";
    let ground = "";

    let flat = function(size) {
        for (let count = 0; count < size; count++){
            sky2 += " ";
            sky1 += " ";
            ground += "_";
        }
    };
    let hill = function(size) {
        sky2 += " ";
        sky1 += " ";
        ground += "/";
        for (let count = 0; count < size; count++){
            sky2 += " ";
            sky1 += "_";
            ground += " ";
        }
        sky2 += " ";
        sky1 += " ";
        ground += "\\";
    };
    let mountain = function(size) {
        sky2 += "  ";
        sky1 += " /";
        ground += "/ ";
        for (let count = 0; count < size; count++){
            sky2 += "_";
            sky1 += " ";
            ground += " ";
        }
        sky2 += "  ";
        sky1 += "\\ ";
        ground += " \\";
    };


    //BUILD SCRIPT
    flat(3)
    mountain(3);
    flat(2);
    mountain(50);
    flat(4);
    hill(1);
    flat(1);
    //END SCRIPT
    sky2 += ("\n" + sky1 + "\n" + ground + "\n");
    return sky2;


};

console.log("");
console.log(landscape());
//  ___/''''\______/'\_
