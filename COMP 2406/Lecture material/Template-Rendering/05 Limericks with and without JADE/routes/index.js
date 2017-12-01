
/*
 * GET home page.
 */

var state = [];

exports.index = function(req, res){
    res.render('index', { title: 'COMP 2406 Simple form demo' });
};

exports.dragNDropJade = function(req, res){
    //showing  a few words passed in to jade template
    res.render('dragDropJade', { title: 'Word Page Demo', words: ['Bird','House','Tree']});
};

exports.add = function(req, res){
    var obj = { name: req.body.name,
		city: req.body.city,
                country: req.body.country,
                birthday: req.body.birthday,
                email: req.body.email };
    state.push(obj);
   res.redirect(303, '/thankyou');
};

exports.wordSubmit = function(req, res){
	console.log("Received Word: " + req.body.word);
	res.send("Thanks, no new content", 204); 
};

exports.userlist = function(req, res){
  res.render('userlist', { title: 'People Listing', items: state });
};

