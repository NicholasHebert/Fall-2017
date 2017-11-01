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
exports.respondErr = function(err) {
    console.log("Handling error: ", err);
    if (err.code === "ENOENT") {
        serve404();
    } else {
        respond(500, err.message, null);
    }
}


//locally defined helper function
//serves 404 files
exports.serve404 = function() {
    fs.readFile(ROOT + "/404.html", function(err, data) { //async
        if (err) respond(500, err.message, null);
        else respond(404, data, mime.lookup(filename));
    });
}
