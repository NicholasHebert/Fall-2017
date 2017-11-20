const http = require('http').createServer(handler);
const io = require('socket.io')(http);
const fs = require('fs');
const url = require('url');
const mime = require('mime-types');
const ROOT = './public';
const INDEX = 'index.html';
const helper = require('./modules/helpers.js')

http.listen(3000);
console.log("Server is listning on port 3000, control+c to quit\nAccessible on http://localhost:3000");

var clients = [];       //current socket list
var gm = "";            //current game master socket
var gmName = "";        //current game master name
var currAnswer = "";    //current secret answer
var gameState = false;  //current state of the game (true for in play, false for no play)

//START: this template was given by Professor Andrew Runka for the fall term of 2016
//simple http server which can handle a multitude of requests
function handler(req, res) {
    //log the request
    console.log(req.method + " request for: " + req.url);

    //parse the url
    var urlObj = url.parse(req.url);
    var filename = ROOT + urlObj.pathname;

    //the callback sequence for static serving
    fs.stat(filename, function(err, stats) { //asyncronous server call
        if (err) { //try and open the file and handle the error
            helper.respondErr(err, fs, mime, res, filename);
        } else if (stats.isDirectory()) {
            fs.readFile(filename + "index.html", function(err, data) { //async
                if (err) {
                    helper.respondErr(err, fs, mime, res, filename);
                } else {
                    helper.respond(200, data, mime.lookup(filename + "index.html"), res);
                }
            });
            //handle the serving of data
        } else {
            fs.readFile(filename, function(err, data) {
                if (err) {
                    helper.respondErr(err, fs, mime, res, filename);
                } else {
                    helper.respond(200, data, mime.lookup(filename), res);
                }
            });
        }
    }); //end handle request
}

io.on("connection", function(socket) {  //on first connection, save data and welcome
    socket.on("intro", function(data) {
        socket.username = JSON.parse(data);
        console.log("Got a connection from: " + socket.username);
        console.log(socket.id);
        socket.gm = false;
        clients.push(this);
        broadcast(helper.getTime() + ": " + socket.username + " has entered the chatroom.");
        socket.send(JSON.stringify("Welcome " + socket.username + "!"));

        io.emit("userList", JSON.stringify(clients.map(function(client) {
            return client.username;
        })));
    });

    var draw = function(data) {     //send draw data
        io.emit("draw", JSON.stringify(data));
    }

    var message = function(data) {  //send message and check if the message was the answer
        try{
            var message = JSON.parse(data);
        } catch (e) {
            console.log("cannot parse what is already parsed");
            message = data;
        }
        if (message.search(currAnswer) > -1 && gameState && gm != socket.id) {
            io.emit("message", JSON.stringify("*** Game Ended ***\n" + socket.username + " solved the puzzle\n The answer was: " + currAnswer));
            timer(false);
            clearBoard();
            gameState = false;
        } else {
            broadcast(helper.getTime() + ", " + socket.username + ": " + message);
        }
    }

    var broadcast = function(data) {    //send to all but socket
        socket.broadcast.emit("message", JSON.stringify(data));
    }

    var submitAnswer = function(data) { //process game start, requires a secret word
        //save answer
        currAnswer = data;
        gameState = true;
        io.emit("message", JSON.stringify("*** Game Started ***"));
        clearBoard();
        timer(true);
        var seconds = 61;
        var x = setInterval(function() {
            if (!gameState) {
                clearInterval(x);
            }
            seconds = seconds - 1;
            if (seconds < 0) {
                clearInterval(x);
                gameState = false;
                io.emit("message", JSON.stringify("*** Game Ended ***\n No winners, answer was " + currAnswer));
                currAnswer = "";
            }
        }, 1000);
    }
    var disconnect = function() {   //handle disconnect
        if (gm == socket.id) {
            gm = "";
            gameState = false;
            message(socket.username + " is no longer drawing!");
            timer(false);
            clearBoard();
            message(helper.getTime() + ": " + socket.username + " disconnected.");
        } else {
            message(helper.getTime() + ": " + socket.username + " disconnected.");
        }
    }

    var gamemasterState = function(data) {  //make a player a man... erhm, a game master
        socket.emit("gamemasterState", JSON.stringify(data));   //this shows or removes the controls
    }

    var gamemaster = function() {
        if (gm == "") {
            gm = socket.id;
            gmName = socket.username;
            message("Server: " + socket.username + " is now drawing!");
            socket.send(JSON.stringify("Server to you:\n1. You are now Drawing!\n2. Type a word in the blue text area to start the timer\n3. Draw in the whitebox to get your friends to guess the word you wrote"));
            gamemasterState(true);
            return;
        } else if (gm == socket.id) {
            socket.send(JSON.stringify("Server to you:\n You're already drawing"));
        } else {
            socket.send(JSON.stringify("Server to you:\n " + gmName + " is currently drawing, please wait"));
        }
    }

    var resign = function() {
        if (gm == socket.id) {
            gm = "";
            message("Server: " + socket.username + " is no longer drawing!");
            socket.emit("gamemasterState", JSON.stringify(false));
            gameState = false;
            timer(false);
            clearBoard();
        } else {
            socket.send(JSON.stringify("Server to you:\n You aren't currently drawing and cannot resign"));
        }
    }

    var timer = function(data) {
        io.emit("timer", JSON.stringify(data));
    }

    var clearBoard = function() {
        io.emit("clearBoard");
    }


    socket.on("draw", function(data) {
        if (socket.id === gm) {
            draw(JSON.parse(data));
        }
        return;
    });

    socket.on("message", function(data) {
        console.log("got message: " + data);
        message(data);
    });

    socket.on("disconnect", function() {
        console.log(socket.username + " disconnected");
        disconnect();
        clients = clients.filter(function(clients) {
            return clients !== socket;
        });
        io.emit("userList", clients.map(function(client) {
            return JSON.stringify(client.username);
        }));
    });

    socket.on("gamemaster", function() {
        gamemaster();
    });

    socket.on("resign", function() {
        resign();
    });

    socket.on("clearBoard", function() {
        clearBoard();
    });

    socket.on("submitAnswer", function(data) {
        submitAnswer(JSON.parse(data));
    });
});
