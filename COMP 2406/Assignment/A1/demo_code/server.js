//Server Code
var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url'); //to parse url strings

var counter = 1000; //to count invocations of function(req,res)


var ROOT_DIR = 'html'; //dir to serve static files from

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
    'txt': 'text/plain'
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

    var receivedData = '';

    //attached event handlers to collect the message data
    request.on('data', function(chunk) {
        receivedData += chunk;
    });

    //event handler for the end of the message
    request.on('end', function() {
        console.log('received data: ', receivedData);
        console.log('type: ', typeof receivedData);

        //if it is a POST request then echo back the data.
        if (request.method == "POST") {

            if (urlObj.pathname == "/userText") {
                var dataObj = JSON.parse(receivedData);
                var title = dataObj.text.toLowerCase();
                title = title.split(" ").join("");

                fs.readFile('./songs/' + title + '.txt', "utf8", function(err, data) {
                    if (err) {
                        console.log("USER REQUEST: " + dataObj.text);
                        var returnObj = {};
                        returnObj.found = false;

                    } else {
                        console.log("USER REQUEST: " + dataObj.text);
                        var returnObj = {};
                        returnObj.found = true;
                        returnObj.lyric = data;
                        console.log(returnObj.lyric);
                    }
                    //object to return to client
                    response.writeHead(200, {
                        'Content-Type': MIME_TYPES["text"]
                    }); //does not work with application/json MIME

                    try {
                        JSON.parse(returnObj);
                        response.end(returnObj);
                    } catch (err) {
                        response.end(JSON.stringify(returnObj)); //send just the JSON object
                    }
                });
            } else if (urlObj.pathname == "/saveSong") {
                var dataObj = JSON.parse(receivedData);
                var saveData = JSON.stringify(dataObj.song);
                var filename = ("./songs/" + dataObj.title + ".txt");
                console.log(saveData);
                console.log(filename);
                fs.writeFile(filename, saveData, function(err) {
                    if (err) {
                        response.end(err);
                    }
                    console.log(filename + " has been saved");
                    response.end("success");
                });
            }
        }
    });

    if (request.method == "GET") {
        //handle GET requests as static file requests
        var filePath = ROOT_DIR + urlObj.pathname;
        if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

        fs.readFile(filePath, function(err, data) {
            if (err) {
                console.log('ERROR: ' + err);
                response.writeHead(404);
                response.end(JSON.stringify(err));
                return;
            }
            response.writeHead(200, {
                'Content-Type': get_mime(filePath)
            });
            response.end(data);
        });
    }
}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
