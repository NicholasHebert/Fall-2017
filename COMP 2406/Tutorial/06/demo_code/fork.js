/*
Interacting with external services

Simple example of node.js app serving contents based
on an available internet service.
In this case api.openweathermap.org

***IMPORTANT NOTE***
As of 2015 openweather requires that you provide an APPID
with your HTTP requests. You can get on by creating a
free account at: http://openweathermap.org/appid

To Test: Use browser to view http://localhost:3000/
*/

let http = require('http')
let url = require('url')
let qstring = require('querystring')

const PORT = process.env.PORT || 3000
//Please register for your own key replace this with your own.
const API_KEY = '4fbe8e55ca5938f4ebf279a785164229'

function sendFoodRes(food, res){

  console.log("Serving file")
  var page = '<html><head><title>API Example</title>'+
  '<style>img {height: 200px; width: 200px; float: center;}div.box{float: left; margin: 10pt; border: 5pt solid black; border-radius: 10pt; padding: 10pt; width: 250px; height: 250px;}</style>' +
   '</head>' +
    '<body>' +
    '<form method="post">' +
    'Ingredient: <input name="ingredient"><br>' +
    '<input type="submit" value="Get Weather">' +
    '</form>'
  if(food){
      page += '<h1>Response </h1>'//<p>' + food +'</p>'
      page += '<div>'
      //console.log(food.recipes);
      let myRes = JSON.parse(food);
      for(i in myRes.recipes) {
        console.log(myRes.recipes[i].image_url);
        page+= '<div class="box">'
        page += '<img src="' + myRes.recipes[i].image_url + '"/><br/>'
        page+= myRes.recipes[i].title;
        page+= '</div>'
      }
      page += '</div>'
  }
  page += '</body></html>'
  res.end(page);
}



function parseData(food, res) {
  //console.log(foodRes)
  let foodRes = ''
  food.on('data', function (chunk) {
    foodRes += chunk
    //console.log("Chuck: " + chunk)
  })
  food.on('end', function () {
    try {
      console.log("done parsing")
      sendFoodRes(foodRes, res)

    }
    catch (err) {
      console.log("cannot parse food")
    }
  })
  //sendResponse(foodRes, res);
}

function getRecipes(ingredient, res){

//You need to provide an appid with your request.
//Many API services now require that clients register for an app id.

  const options = {
     host: 'www.food2fork.com',
     path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
  http.request(options, function(apiResponse){
    console.log("Got Response")

    //console.log(apiResponse);
    try {
      parseData(apiResponse, res)

    }
    catch(err) {
      console.log(err)
    }
  }).end()
}

http.createServer(function (req, res) {
  let requestURL = req.url
  let query = url.parse(requestURL).query //GET method query parameters if any
  let method = req.method
  console.log('----------------------------------------------')
  console.log(`${method}: ${requestURL}`)
  console.log(`query: ${query}`) //GET method query parameters if any

  if (req.method == "POST"){
    let reqData = ''
    req.on('data', function (chunk) {
      reqData += chunk
    })
    req.on('end', function() {
	  console.log(reqData);
      var queryParams = qstring.parse(reqData)
	  console.log("Query Params: " + queryParams.ingredient)
      getRecipes(queryParams.ingredient, res)
    })
  } else{ //If it is a get request
    if(query) {
      let ing = qstring.parse(query).ingredient
      console.log("Looking for : " + ing)
      getRecipes(ing, res)
    }
    else {
      console.log("null request")
      sendFoodRes('', res)
    }
  }
}).listen(PORT, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
})
