exports.getId = function(len) {
    var rArray = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    var result = '';
    for (var i = len; i > 0; --i) {
        result += rArray[Math.floor(Math.random() * rArray.length)];
    }
    return result;
}

exports.getTime = function() {
    return new Date().toLocaleTimeString();
}

//                                                    🤷       🤷
//These functions were thrown here because why not    ¯\_(ツ)_/¯

//locally defined helper function
//sends off the response message
exports.respond = function(code, data, contentType, res) {
    // content header
    res.writeHead(code, {
        'content-type': contentType || 'text/html'
    });
    // write message and signal communication is complete
    res.end(data);
}

//locally defined helper function
//responds in error, and outputs to the console
exports.respondErr = function(err, fs, mime, res, filename) {
    console.log("Handling error: ", err);
    if (err.code === "ENOENT") {
        fs.readFile("./public/404.html", function(err, data) { //async
            if (err) {
                res.writeHead(500, {
                    'content-type': null || 'text/html'
                });
                res.end(err.message);
            } else {
                res.writeHead(404, {
                    'content-type': mime.lookup(filename) || 'text/html'
                });
                res.end(data);
            }
        });
    } else {
        res.writeHead(500, {
            'content-type': null || 'text/html'
        });
        res.end(err.message);
    }
}
