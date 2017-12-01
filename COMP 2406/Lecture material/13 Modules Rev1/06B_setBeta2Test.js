/*
Demonstration code to test Set ADT
*/

var Set = require('./set_beta2.js'); 
var set = new Set();

set.add('Lou');
set.add('Sue');
set.add('John');
set.add('Lilly');
set.add('Sandra');

set.remove('Frank');
set.remove('Sue');

console.log(set.toString());
console.log(set.contains('Lou'));
console.log(set.contains('Anne'));



