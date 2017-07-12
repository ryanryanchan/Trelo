var express = require('express');
var router = express.Router();
var auth = require('../auth');

var User = require('../models/user');
var Board = require('../models/board');

/* GET page. */
router.get('/:id', auth,  function(req, res, next) {
	Board.findOne({_id: req.params.id}, function(err, board){
		if (err){console.log(err);} 
		else{
			if(board.author != req.session.user.username){
				console.log('not author');
				if(!board.members.includes(req.session.user.username)){
					console.log('not member');
					res.redirect('/boards');
					return;
				}
			}
			console.log('rendering board');
 			res.render('board', { title: 'Express', href: '../stylesheets/board.css', bid: req.params.id});
		}
	});
});

module.exports = router;