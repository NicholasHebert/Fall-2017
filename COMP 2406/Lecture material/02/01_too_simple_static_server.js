/*
Example of node as a "too simple static server". 
Here our node server does not try to analyse the url to "route" the requests, it simply serves whatever files happen to be in the ROOT_DIR directory.

This is pretty much how you would set things up with an apache http server. 
This example is too simple to handle all cases. 
For example it can serve simple html docs with imbedded images and imbedded css styles 
but fails when css styles are in separate files. 
This is why we are calling it "too simple".

Exercise: can you figure out why it fails? 
(Hint, what response decisions is the node.js function still 
making even though it is basically serving the contents 
of files without looking at them.
*/

/*
Use browser to view pages at http://localhost:3000/index.html.

*/

//Cntl+C to stop server (in Windows CMD console)

var http = require('http'); //need for http communication
var fs = require('fs'); //need to read static files
var url = require('url'); //helpful module to parse url string

var counter = 1000; //to count invocations of function(req,res)

var ROOT_DIR = 'html'; //dir for our static files

http.createServer(function (request,response){
     var urlObj = url.parse(request.url, true, false);
     console.log("PATHNAME: " + urlObj.pathname);
     console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);

     fs.readFile(ROOT_DIR + urlObj.pathname, function(err,data){
       if(err){
          console.log('ERROR: ' + JSON.stringify(err));
          response.writeHead(404);
          response.end(JSON.stringify(err));
          return;
         }
         response.writeHead(200, {'Content-Type': 'text/html'});
         response.end(data); 
       });

 }).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');