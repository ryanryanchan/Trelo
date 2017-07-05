var express = require('express');
var router = express.Router();

var session = require('client-sessions');


var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('board', { title: 'Express', href: 'stylesheets/board.css'});

  if (req.session && req.session.user) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    User.findOne({ email: req.session.user.email }, function (err, user) {
      if (!user) {
        // if the user isn't found in the DB, reset the session info and
        // redirect the user to the login page
        console.log('asdfasdfa');
        req.session.reset();
        res.redirect('/login');
      } else {
        // expose the user to the template
        res.locals.user = user;
 		console.log(user);
        // render the dashboard page
        res.render('dashboard.jade');
      }
    });
  } else {
  	console.log('nothing');
    res.send('/login');
  }

});

router.get('/test',function(req,res){
	res.send('hihihih');
});

module.exports = router;