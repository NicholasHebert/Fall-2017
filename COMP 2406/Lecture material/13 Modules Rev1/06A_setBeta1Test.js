
/*
Demonstration code to test Set ADT
*/

var set = require('./set_beta1.js'); 

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



