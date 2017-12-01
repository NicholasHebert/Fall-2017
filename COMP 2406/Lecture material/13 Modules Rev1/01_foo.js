/*
Importing modules from node_modules or file system
*/

var bar1 = require("bar");  //search node_modules folder for bar.js
var bar2 = require("./bar"); //search current directory for bar.js
var bar3 = require("obj"); //search node_nodules folder for obj
bar1();
bar2();
console.log(bar3);


