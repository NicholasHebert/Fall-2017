/*
example from: Sams Teach Yourself Node.js in 24 hours

code example using the underscore.js module
which was installed from npm online registry using commandline:

npm install underscore

To learn about the underscore module visit:
http://npmjs.org/
also
http://underscorejs.org/

Underscore provide functional-style (think callback functions)
utilities for iterating over collections

Using an _ seems an odd choice for variable in node.js code
but that is traditionally because in the browser a global
variable by that name is used.
*/

var _ = require('underscore');
_.each([1,2,3], function(num){
   console.log("underscore.js says: " + (num*10));
});

var arr = [1, 10,50,200,900,90,40]; 
var results = _.filter(arr, function(item){ 
    return item > 40 }); 
console.log( results);



/*
OUTPUT:
underscore.js says: 10
underscore.js says: 20
underscore.js says: 30
[ 50, 200, 900, 90 ]
*/


