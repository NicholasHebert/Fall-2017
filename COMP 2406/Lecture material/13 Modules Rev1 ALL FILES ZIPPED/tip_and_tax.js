/*
Example of exporting properties to client who "require()" this module

NOTE: don't use both exports.xxx and module.exports in the same module -they will conflict

Tip and Tax
============
Module to help compute tax and tip for restaurant prices

*/

var tipPercentage = 15; //traditional amount
var taxPercentage = 13; //Ontario HST 2015

function calcTip(x) {return x*tipPercentage/100;}
function calcTax(x) {return x*taxPercentage/100;}
exports.tip = calcTip;
exports.tax = calcTax;
exports.total = function(x) {return x + calcTip(x) + calcTax(x);}



