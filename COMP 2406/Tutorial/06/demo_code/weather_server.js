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
//Old Key: f45b6d23576028c0609371dd5060e010
const API_KEY = '158994e7cd2ef3757f092e2bb19823a8'

function sendResponse(weatherData, res) {
    var page = '<html><head><title>API Example</title></head>' +
        '<body>' +
        '<form method="post">' +
        'City: <input name="city"><br>' +
        '<input type="submit" value="Get Weather">' +
        '</form>'
    if (weatherData) {
        var weather = JSON.parse(weatherData);
        var temp = weather["main"]["temp"] - 273.15
        var min = weather["main"]["temp_min"] - 273.15
        var max = weather["main"]["temp_max"] - 273.15
        var description = weather["weather"][0]["description"]
        var city = weather.name

        page += '<h1>Weather Info: ' + city + '</h1>' +
            '<p>Weather looks like: ' + description + '</p>' +
            '<p>Temperature: ' + temp + '</p>' +
            '<p>High of: ' + max + ' Low of: ' + min + '</p>'
    }
    page += '</body></html>'
    res.end(page);
}

function parseWeather(weatherResponse, res) {
    let weatherData = ''
    weatherResponse.on('data', function(chunk) {
        weatherData += chunk
    })
    weatherResponse.on('end', function() {
        sendResponse(weatherData, res)
    })
}

function getWeather(city, res) {

    //New as of 2015: you need to provide an appid with your request.
    //Many API services now require that clients register for an app id.

    //Make an HTTP GET request to the openweathermap API
    let options = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/weather?q=' + city +
            '&appid=' + API_KEY
    }
    http.request(options, function(apiResponse) {
        parseWeather(apiResponse, res)
    }).end()
}

http.createServer(function(req, res) {
    let requestURL = req.url;
    let query = url.parse(requestURL).query; //GET method query parameters if any
    let method = req.method;
    console.log(`${method}: ${requestURL}`);
    console.log(`query: ${query}`); //GET method query parameters if any

    if (req.method == "GET") {
        console.log("got a get request");
        if (query) {
            var queryString = qstring.parse(query);
            console.log(queryString.city);
            getWeather(queryString.city, res);
            console.log("got there");
        } else {
            sendResponse(null, res);
        }
    } else if (req.method == "POST") {
        console.log("got a post request");
        let reqData = '';
        req.on('data', function(chunk) {
            reqData += chunk;
        })
        req.on('end', function() {
            console.log(reqData);
            var queryParams = qstring.parse(reqData);
            console.log(queryParams);
            getWeather(queryParams.city, res);
        })
    } else {
        sendResponse(null, res)
    }
}).listen(PORT, (error) => {
    if (error)
        return console.log(error)
    console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
})
