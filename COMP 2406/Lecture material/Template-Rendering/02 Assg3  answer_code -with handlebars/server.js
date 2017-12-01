/*
To Start App: http://localhost:3000
Start with initial ingredients http://localhost:3000?ingredient=Basil
To get JSON recipe data: http://localhost:3000/recipes?ingredient=Basil
*/
const express = require('express')
const requestModule = require('request')
var path = require('path');
const fs = require('fs')
const PORT = 3000
const API_KEY = 'ea7fece92c473f1acd3e574f230d46ca'

const app = express()

// view engine setup to use handlebars
//requires: npm install hbs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

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
  //use handlebars rendering
  if(!ingredient){
    response.render('index', {ingredient: ""});
  }
  else {
	response.render('index', {ingredient: request.query.ingredient});
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