/*
NOTE: This base code is a template given by Lou Nel in class. My code replaced
 his pre-existing open weather code

NOTE: THIS CODE WILL NOT RUN UNTIL YOU ENTER YOUR OWN openweathermap.org APP ID KEY

NOTE: You need to intall the npm modules by executing >npm install
before running this server

Simple express server re-serving data from openweathermap.org
To test:
http://localhost:3000
or
http://localhost:3000/weather?city=Ottawa
to just set JSON response. (Note it is helpful to add a JSON formatter extension, like JSON Formatter, to your Chrome browser for viewing just JSON data.)
*/
const express = require('express') //express framework
var requestP = require('request-promise'); //npm module for easy http requests
const PORT = process.env.PORT || 3000
const API_KEY = '3d1aad3aa7ac8a9c8ad384029e3bcad8'


const app = express()

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

//the response we give when a client tries to query recipes
app.get('/recipes', (request, response) => {
    let ingredients = request.query.ingredients.replace(/ /g,",")//separate spaces by coma instead
    console.log(ingredients)
    if (!ingredients) {//edge case incase user manages to send a response without ingredients
        console.log("no ingredients")
        return response.json({
            message: 'Please enter ingredients'
        })
    }
    const options = {
        method: 'GET',
        uri: 'https://www.food2fork.com/api/search?q=' + ingredients + '&key=' + API_KEY,
    }
    console.log(options)
    requestP(options)//our promise statement which simplifies http requests
        .then(function(res) {
            return response.json(JSON.parse(res))//send json string
        })
        .catch(function(err) {
            console.log(err)
            return
        })
})

//start server
app.listen(PORT, err => {
    if (err) console.log(err)
    else {
        console.log(`Server listening on port: ${PORT}`)
    }
})
