var express = require('express');
var router = express.Router();
var auth = require('../auth');

router.get('/', auth, function(req, res, next) {
  res.render('boards',  { title: 'Login', href: 'stylesheets/boards.css'});
});

module.exports = router;