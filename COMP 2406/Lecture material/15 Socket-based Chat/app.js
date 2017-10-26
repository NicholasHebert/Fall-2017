/*
Before you run this app first execute
>npm install
to load npm modules listed in package.json file

Then launch this server.
Then open several browsers to: http://localhost:3000/index.html

*/

var http = require('http');
//npm modules (need to install these first)
var WebSocketServer = require('ws').Server; //provides web sockets
var ecStatic = require('ecstatic'); //provides static file server service
var clients = [];
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];

//static file server
var server = http.createServer(ecStatic({
    root: __dirname + '/www'
}));

var wss = new WebSocketServer({
    server: server
});
wss.on('connection', function(ws) {
    ws.on('message', function(msg) {
        console.log((new Date()) + ' Message: ' + msg);
        broadcast(msg);
    });
    ws.on('open', function(name){
        console.log((new Date()) + " " + name + " connected");
        client.push(name);
        broadcast(name + " has connected");
    });
});

function broadcast(msg) {
    wss.clients.forEach(function(client) {
        client.send(msg);
    });
}

server.listen(3000);
console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
