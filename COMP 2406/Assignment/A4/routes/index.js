var url = require('url');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/recipes.db');
var fs = require('fs');
var parser = require('xml2json');

db.serialize(function() {
    //make sure a couple of users exist in the database.
    //user: ldnel password: secret
    //user: frank password: secret2
    var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO users VALUES ('ldnel', 'secret')";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO users VALUES ('frank', 'secret')";
    db.run(sqlString);
});

exports.authenticate = function(request, response, next) {
    /*
	Middleware to do BASIC http 401 authentication
	*/
    var auth = request.headers.authorization;
    // auth is a base64 representation of (username:password)
    //so we will need to decode the base64
    if (!auth) {
        //note here the setHeader must be before the writeHead
        response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
        response.writeHead(401, {
            'Content-Type': 'text/html'
        });
        console.log('No authorization found, send 401.');
        response.end();
    } else {
        console.log("Authorization Header: " + auth);
        //decode authorization header
        // Split on a space, the original auth
        //looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        var tmp = auth.split(' ');

        // create a buffer and tell it the data coming in is base64
        var buf = new Buffer(tmp[1], 'base64');

        // read it back out as a string
        //should look like 'ldnel:secret'
        var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);

        //extract the userid and password as separate strings
        var credentials = plain_auth.split(':'); // split on a ':'
        var username = credentials[0];
        var password = credentials[1];
        console.log("User: ", username);
        console.log("Password: ", password);

        var authorized = false;
        //check database users table for user
        db.all("SELECT userid, password FROM users", function(err, rows) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].userid == username & rows[i].password == password) authorized = true;
            }
            if (authorized == false) {
                //we had an authorization header by the user:password is not valid
                response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
                response.writeHead(401, {
                    'Content-Type': 'text/html'
                });
                console.log('No authorization found, send 401.');
                response.end();
            } else
                next();
        });
    }

    //notice no call to next()

}

function addHeader(request, response) {
    // about.html
    var title = 'COMP 2406:';
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write('<!DOCTYPE html>');
    response.write('<html><head><title>About</title></head>' + '<body>');
    response.write('<h1>' + title + '</h1>');
    response.write('<hr>');
}

function addFooter(request, response) {
    response.write('<hr>');
    response.write('<h3>' + 'Carleton University' + '</h3>');
    response.write('<h3>' + 'School of Computer Science' + '</h3>');
    response.write('</body></html>');

}

function readFile(filename, callback) {
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        }
        console.log("Got file");
        try {
            var xml2json = parser.toJson(data);
            xml2json = JSON.parse(xml2json);
            console.log("Converted file");
            callback(null, xml2json);
        } catch (e) {
            callback(e);
            return;
        }
    });
}


exports.index = function(request, response) {
    // index.html
    response.render('index', {
        title: 'COMP 2406',
        body: 'rendered with handlebars<p><href></href></p>'
    });
}

function parseURL(request, response) {
    var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery, slashHost);
    console.log('path:');
    console.log(urlObj.path);
    console.log('query:');
    console.log(urlObj.query);
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
    return urlObj;

}

exports.users = function(request, response) {
    // users.html
    db.all("SELECT userid, password FROM users", function(err, rows) {
        response.render('users', {
            title: 'Users:',
            userEntries: rows
        });
    })
}

exports.find = function(request, response) {
    // find.html
    console.log("RUNNING FIND RECIPES");

    var urlObj = parseURL(request, response);
    var sql = "SELECT id, title FROM recipes";

    if (urlObj.query['title']) {
        console.log("finding title: " + urlObj.query['title']);
        sql = "SELECT id, title FROM songs WHERE title LIKE '%" +
            urlObj.query['title'] + "%'";
    }

    db.all(sql, function(err, rows) {
        response.render('recipes', {
            title: 'Recipes:',
            recipeEntries: rows
        });
    });
}
exports.recipeDetails = function(request, response) {

    var urlObj = parseURL(request, response);
    var recipeID = urlObj.path; //expected form: /song/235
    recipeID = recipeID.substring(recipeID.lastIndexOf("/") + 1, recipeID.length);

    var sql = "SELECT id, title, composer, key, bars FROM songs WHERE id=" + recipeID;
    console.log("GET SONG DETAILS: " + recipeID);

    db.all(sql, function(err, rows) {
        console.log('Recipe Data');
        console.log(rows);
        response.render('recipeDetails', {
            title: 'Recipe Details:',
            recipeEntries: rows
        });
    });

}
exports.truncate = function(request, response) {
    var sql = "DELETE FROM Recipes";
    db.all(sql);
    console.log('Deleted Table Recipes');
}
exports.fill = function(request, response) {
    readFile("./public/aLaCarteData_rev3.xml", function(err, data) {
        if (err) {
            console.log(err);
        } else {

            for(var i=0; i<data.recipes_xml.recipe.length; i++){
                console.log(data.recipes_xml.recipe[i]);
            }
        }
    });
}
