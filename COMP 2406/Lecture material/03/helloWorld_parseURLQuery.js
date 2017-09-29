/*
Hello World example to serve string to client
*/

//use browser to view http://localhost:3000
//Try http://localhost:3000/?name=Lou&email=ldnel@scs.carleton.ca

//Cntl+C to stop server

/*This example shows using a built in node.js module url
  used to help parse the url from the request.
  Here we require(url);
  and use the capabilities of that module to parse the url string

  Exercise:
  why do we seem to see the counter go up by two when the browser makes a request

  modify the code so that a querystring ?name='Lou' would result in a greeting
  'Hello Lou' instead of 'Hello World' on the browser.
  */

var http = require('http');
var url = require('url'); //to help parse url string from request
var counter = 1000;

var hello = 'Hello';
var greetName = 'World';

http.createServer(function (request,response){
   console.log("\n********************************************");
   console.log("\nREQUEST OBJECT");
   console.log("================");
   console.log("url: " + request.url);
   console.log("method: " + request.method);
   console.log("request headers:");
   console.log(request.headers);

   var parsedURL = url.parse(request.url,
                             true, //parse the query string portion of url
							 false); //slashes denote host
							 /*
							 Pass true as the third argument to treat
							 //foo/bar as { host: 'foo', pathname: '/bar' }
							 rather than { pathname: '//foo/bar' }. Defaults to false.
							 */

   console.log("\nPARSED QUERY OBJECT:");
   console.log(parsedURL.query);
   console.log("\nPARSED PATH NAME:");
   console.log(parsedURL.pathname);

   //Exercise answer code
   if(parsedURL.pathname !== '/favicon.ico'){
      if(parsedURL.query.name) greetName = parsedURL.query.name;
	  else greetName = 'World';
   }

   //write HTTP header
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.write(hello + ' ');
   response.write(greetName);
   //end HTTP response and provide final data to send
   response.end("["+ counter++ + "]\n");
   console.log("");
   console.log("\nRESPONSE OBJECT");
   console.log("================");
   console.log("response: " + response);
   console.log("response.statusCode: " + response.statusCode);
   console.log("response._header: " + response._header);
   console.log("");

}).listen(3000, "127.0.0.1");
console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
