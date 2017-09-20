/*
Is it possible to have a single callback and chain the execution?
*/

function read(callback) {
  setTimeout(function(){console.log("read data"); callback();},
             Math.floor((Math.random() * 1000) + 1));
}

function process(callback) {
  setTimeout(function(){console.log("process data"); callback();},
             Math.floor((Math.random() * 1000) + 1));
}

function output() {
  setTimeout(function(){console.log("output data");},
             Math.floor((Math.random() * 1000) + 1));
}

read(process); //<-- WILL THIS WORK




 
