const http = require('http').createServer(server);
const io = require('socket.io')(http);
const fs = require('fs');
const url = require('url');
const mime = require('mime-types');
const ROOT = './public';
const INDEX = 'index.html';

http.listen(3000);
console.log("Server is listning on port 3000, control+c to quit");

var clients = [];
var history = [];

function server(request, response) {
    //save filename as the requested url from the public folder
    var filename = ROOT + url.parse(request.url).pathname;
    fs.stat(filename, function(err, stat) {
        if (err) {
            respondErr(err);
        } else {
            fs.readFile(filename + INDEX, function(err, data) {
                if (err) {
                    respondErr(err);
                } else {
                    respond(200, data, mime.lookup(filename));
                }
            });
        }
    });

    function respondErr(err) {
        console.log('Handling error: ', err);
        if (err.code === 'ENOENT') {
            serve404();
        } else {
            respond(500, err.message, null);
        }
    }

    function serve404() {
        fs.readFile(ROOT + '/404.html', 'utf8', (err, data) => { // arrow functions (ES6)
            if (err) {
                respond(500, err.message, null);
            } else {
                respond(404, data, mime.lookup(filename));
            }
        });
    }

    //simple reusable function to save on space
    function respond(code, data, contentType) {
        response.writeHead(code, {
            'content-type': contentType || 'text/html'
        });
        response.end(data);
    }
}

io.on("connection", function(socket) {
    socket.on("intro", function(username) {
        console.log("Got a connection from: " + username);
        socket.username = username;
        users.push(this);
        socket.broadcast.emit("message", timestamp() + ": " + socket.username + " has entered the chatroom.");
        socket.emit("message", "Welcome " + socket.username + "!");
        socket.blockedUsers = [];
        io.emit("userList", users.map(function(user) {
            return user.username;
        }));
    });

    socket.on("message", function(data) {
        console.log("got message: " + data);
        history.push(timestamp() + ", " + socket.username + ": " + data)
        socket.broadcast.emit("message", timestamp() + ", " + socket.username + ": " + data);
    });

    socket.on("disconnect", function() {
        console.log(socket.username + " disconnected");
        users = users.filter(function(user) {
            return user !== socket;
        });
        io.emit("message", timestamp() + ": " + socket.username + " disconnected.");
        io.emit("userList", users.map(function(user) {
            return user.username;
        }));
    });
});

function timestamp() {
	return new Date().toLocaleTimeString();
}
