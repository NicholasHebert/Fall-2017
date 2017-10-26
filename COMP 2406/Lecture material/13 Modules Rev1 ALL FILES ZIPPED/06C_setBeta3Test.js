/*
Demonstration code to test Set ADT
*/

var Set = require('./set_beta3.js'); 
var set = new Set();

set.add('Lou');
set.add('Sue');
set.add('John');
set.add('Lilly');
set.add('Sandra');
set.collection.push('Ringo'); //NOT DESIRABLE THAT WE CAN DO THIS
                              //COLLECTION IS A PUBLIC MEMBER OF SET
set.remove('Frank');
set.remove('Sue');

console.log(set.toString());
console.log(set.contains('Lou'));
console.log(set.contains('Anne'));



