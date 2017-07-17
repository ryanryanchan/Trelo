var express = require('express');
var router = express.Router();

var User = require('../models/user');


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', href: 'stylesheets/login.css'});
});

router.post('/', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
  	if (err){console.log(err);} 
    if (!user) {
    	console.log('not user');
      	res.render('login', {  title: "login", error: 'Invalid username or password.' });
    } else {
      if (req.body.password === user.password) {
      	req.session.user = user;
        console.log('password works');
        res.redirect('/boards');
      } else {
      	console.log('password doesnt work');
        res.render('login', { title: "login", error: 'Invalid username or password.' });
      }
    }
  });
});

module.exports = router;