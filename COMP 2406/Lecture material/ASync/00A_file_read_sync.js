
/*
Example of a SYNCHRONOUS file read.
the readFileSync() function blocks (waits) and only returns once the file is read.

See
Node.js v6.x.x API:
https://nodejs.org/dist/latest-v6.x/docs/api/
File System Module fs API:
https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
and more specifically: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_readfilesync_file_options

*/

var fs = require('fs');
var array = fs.readFileSync('songs/sister_golden_hair.txt').toString().split("\n");
for(var i=0; i<array.length; i++) {
    console.log(array[i]); }
console.log("DONE"); 
