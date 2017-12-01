/*
There was a young man from Nantucket ...

This example is meant to illustrate some client side javascript
as both a static .html file version and a jade template version.

(Note this example has been added onto the Form Demo code.
The form demo code is still active in this example but not meant
to be part of this illustration)

launch app with: npm start

Once app is running visit
http://localhost:3000/dragNDrop.html for the static served version
and visit
http://localhost:3000/dragNDropJade for the jade template version.

(Note the jade file was essentially created by reverse engineering
the .html version using the following html-to-jade conversion site:
http://html2jade.aaron-powell.com/
)

This example is adapted from:
Sebesta "Programming the World Wide Web" 6th ed. chapter 6 examples
The example uses straight ahead javascript (not JQuery).

Exercises:
How could you make a limerick and the have the finished
limerick reported to the server?

How could you randomly create words to use?

Build a limerick contest app that puts finished
limericks in a MongoDB database and then lets
users view and vote on the best one.
*/


var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var routes = require('./routes'); //also works explain why
var users = require('./routes/user');

var app = express();

// view engine setup
app.locals.pretty = true; //Express 4.x to see pretty HTML for jade output
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/favicon.ico')); 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//order is important here.
//Try putting the app.get and app.post after the app.use(..static...

//intercept and log all requests to the app
//Note since no path a specified all paths will
//be intercepted (a path of '/' should have the same effect); 

app.use(function(req, res, next){
  console.log('-------------------------------');
  console.log('req.path: ', req.path);
  console.log('HEADER:');

  for(x in req.headers) console.log(x + ': ' + req.headers[x]);

  next(); //allow next route or middleware to run
});

//Three routes used in the GET-POST-Redirect(300)-GET pattern
app.get('/', routes.index); 
app.get('/dragNDropJade', routes.dragNDropJade); 
app.get('/thankyou', routes.userlist); 
app.post('/add', routes.add);
app.post('/wordSubmit', routes.wordSubmit);

//serve static files from public directory.
app.use(express.static(path.join(__dirname, 'public')));


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
