/*

*/

var Calculator = require("./Calculator"); //or "./Calculator.js"


var taxCalculator = new Calculator(13); //our first use of "new"
//var tipCalculator = new Calculator(15);

var itemPrice = 200; //$200.00

console.log("tax: " + taxCalculator.calcTax(itemPrice));
console.log("total : " + taxCalculator.calcTotal(itemPrice));
