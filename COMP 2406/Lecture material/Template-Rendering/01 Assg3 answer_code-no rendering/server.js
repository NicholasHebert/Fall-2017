/*
To Start App: http://localhost:3000
Start with initial ingredients http://localhost:3000?ingredient=Basil
To get JSON recipe data: http://localhost:3000/recipes?ingredient=Basil
*/
const express = require('express')
const requestModule = require('request')
const fs = require('fs')
const PORT = 3000
const API_KEY = 'ea7fece92c473f1acd3e574f230d46ca'

const app = express()

function handleError(response){
	//report file reading error to console and client
    console.log('ERROR: ' + JSON.stringify(err));
	//respond with not found 404 to client
    response.writeHead(404);
    response.end(JSON.stringify(err));
}
function send_index_with_ingredient(request, response, ingredient){
	/*
	This code assembles the response from two partial .html files
	with an ingredient placed between the two parts
	This CLUMSY approach is done here to motivivate the need for
	template rendering. Here we use basic node.js file reading to
	simulate placing data within a file.
	*/
	var filePath1 = __dirname + '/views/index_with_ingredient-part1.html';
	var filePath2 = __dirname + '/views/index_with_ingredient-part2.html';
    fs.readFile(filePath1, function(err,data){
       if(err){ handleError(response); return;}
       response.writeHead(200, {'Content-Type': 'text/html'});
       response.write(data);
	   response.write(ingredient);
	   fs.readFile(filePath2, function(err,data){
           if(err){ handleError(response); return;}
           response.write(data);
	       response.end();
       });	
     });	
}

app.use(express.static(__dirname + '/public'))

app.use(function(request, response, next){
	console.log('LOG:');
	console.log(request.query);
	next();
})

app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT} CNTL-C to quit`)
  }
})

app.get('/', (request, response) => {
  let ingredient = request.query.ingredient
  if(!ingredient){
    response.sendFile(__dirname + '/views/index.html')
  }
  else {
	//send an html file with initial ingredient data embedded in it
	//This clumsy approach is meant to motivate the need for
	//template rendering in future work
	send_index_with_ingredient(request, response, ingredient);
  }
})

app.get('/recipes', (request, response) => {
  let url = ''
  let ingredient = request.query.ingredient
  if(!ingredient) {
    //return response.json({message: 'Please enter a proper ingredient'})
    url = `https://food2fork.com/api/search?key=${API_KEY}`
  }
  else {
    url = `https://food2fork.com/api/search?key=${API_KEY}&q=${ingredient}`
  }
  requestModule.get(url, (err, res, data) => {
    return response.contentType('application/json').json(JSON.parse(data))
  })
})