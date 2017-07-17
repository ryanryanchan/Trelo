var express = require('express');
var router = express.Router();
var auth = require('../auth');
var permission = require('../permission');

var User = require('../models/user');
var Board = require('../models/board');

/* GET page. */
router.get('/:id', auth, permission,  function(req, res, next) {
	console.log('rendering board');
	res.render('board', { title: 'Express', href: '../stylesheets/board.css', bid: req.params.id});
});

module.exports = router;