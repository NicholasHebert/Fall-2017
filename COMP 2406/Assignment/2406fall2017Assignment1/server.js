/*
Example of node as a basic "static" server created with node.js and
only its internal modules: http, url, and fs.

Here our node server does not try to analyse the url to route the requests,
it simply servers whatever files that happen to be in the ROOT_DIR directory.
It does however replace a path of '/' with '/index.html'.

Because it is a static server it does not analyse the requested URL.
It simply serves such a file if it exists in the intended directory.

Unlike our previous Too Simple Server this one uses the file extension
of the requested resoure to decide on the appropriate MIME
type to return to the client.
*/

/*
Use browser to view pages at:
http://localhost:3000/01hello.html
http://localhost:3000/02index.html
http://localhost:3000/03indexXHTML.html
http://localhost:3000/04table.html
http://localhost:3000/05internalCSS.html
http://localhost:3000/06externalCSS.html
http://localhost:3000/07form.html
http://localhost:3000/08canvasDrawing.html
http://localhost:3000/09canvasDragAndDrop.html
http://localhost:3000/10elementDragAndDrop.html
http://localhost:3000/11cssDragAndDrop.html
http://localhost:3000/12canvasWithTimer.html
http://localhost:3000/13elementsBuiltByJavascript.html
*/

//Cntl+C to stop server

var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url'); //to parse url strings


var ROOT_DIR = 'public'; //dir to serve static files from

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', //should really be application/javascript
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/text'
};

var get_mime = function(filename) {
    var ext, type;
    for (ext in MIME_TYPES) {
        type = MIME_TYPES[ext];
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return type;
        }
    }
    return MIME_TYPES['txt'];
};

http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false);
    console.log('\n============================');
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var filePath = ROOT_DIR + urlObj.pathname;
    if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

    fs.readFile(filePath, function(err, data) {
        if (err) {
            //report error to console
            console.log('ERROR: ' + JSON.stringify(err));
            //respond with not found 404 to client
            response.writeHead(404);
            response.end("404! File Not Found!\nYou tried to " + err.syscall + " " + err.path + " and it does not exist\n:-(");
            return;
        }
        response.writeHead(200, {
            'Content-Type': get_mime(filePath)
        });
        response.end(data);
    });

}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
