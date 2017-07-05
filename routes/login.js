var express = require('express');
var router = express.Router();

var session = require('client-sessions');


var User = require('../models/user');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/prello');

router.use(session({
  cookieName: 'session',
  secret: 'secret-string',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', href: 'stylesheets/login.css'});
});

router.post('/', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
  	if (err){console.log(err);} 
    if (!user) {
    	console.log('not user');
      	res.render('login', { error: 'Invalid username or password.' });
    } else {
      if (req.body.password === user.password) {
      	console.log( 'password works' + user + req.session.user + '//////');
      	req.session.user = user;
      	res.json(user);
        //res.redirect('/board');
      } else {
      	console.log('password doesnt work');
        res.render('login', { error: 'Invalid username or password.' });
      }
    }
  });
});

module.exports = router;