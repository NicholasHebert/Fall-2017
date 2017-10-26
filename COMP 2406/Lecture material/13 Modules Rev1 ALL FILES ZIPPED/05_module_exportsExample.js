/*
Example shows issues with using exports and module.exports.
This is a really common source of errors with node and modules
*/
var mod1 = require("./module1.js");
var mod2 = require("./module2.js");

console.log(mod1.a + ", " + mod1.b);
console.log(mod2.a + ", " + mod2.b);

/*
DON'T UNCOMMENT THIS
//module1.js
module.exports.a = 10;
exports.b = 20;

//module2.js
module.exports = {"a":  10};
exports.b = 20;
*/
