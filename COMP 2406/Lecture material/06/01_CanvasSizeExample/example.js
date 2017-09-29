/*

Exercise: modify the code to set the canvas's
width and height from within javascript
e.g. canvas.width  = window.innerWidth;

*/

var drawCanvas = function(canvasID){

var canvas = document.getElementById(canvasID),
    context = canvas.getContext('2d');
   
context.font = '30pt Arial';
context.fillStyle = 'cornflowerblue';
context.strokeStyle = 'blue';

var date = Date().toString();
context.fillText(date, 20, 40);
context.strokeText(date, 20, 40);

								   
context.beginPath();
context.arc(canvas.width/2, //x co-ord
            canvas.height/2, //y co-ord
			canvas.height/2 - 5, //radius
			0, //start angle
			2*Math.PI //end angle
			);
context.stroke();
}

drawCanvas('canvas1');
drawCanvas('canvas2');
