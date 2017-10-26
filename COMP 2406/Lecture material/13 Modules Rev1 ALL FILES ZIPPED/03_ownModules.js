/*
Example of requiring our own helper module

Note the require() function is taking a string here that looks like a path. 
When it does not look like a path require() looks for the module in the 
npm created node_modules directory.
*/

//require our own module
var calculator = require("./tip_and_tax");

var menuPrice = 10.00;

console.log("price: " + menuPrice);
console.log("tip: " + calculator.tip(menuPrice));
console.log("HST: " + calculator.tax(menuPrice));
console.log("total: " + calculator.total(menuPrice));

/* The next line will not work because the non exported features
of the module are private. 
This provides one of the many ways to fake namespaces in javascript 
*/

//console.log("tax percentage" + calculator.taxPercentage );

