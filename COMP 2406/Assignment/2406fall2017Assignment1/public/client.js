window.onload = function() {
    console.log("The page was loaded!!")
    function getSong() {
        console.log("button was pressed!!");
        var songName = document.getElementById('songName');
        var print = "";
        fs.readFile('songs/' + songName + '.txt', function(err, data) {
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
                print += chords.green;
                print += verses.yellow;
                chords = "";
                verses = "";
            }
        });
        document.getElementById("lyrics").innerHTML = print;
        console.log("Served: " + songName);
    }
}
