var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Registration', href: 'stylesheets/register.css'});
});

router.post('/', function(req, res) {
  res.redirect('/login.ejs');
});

module.exports = router;