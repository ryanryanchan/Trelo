var express = require('express');
var router = express.Router();

var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/card');


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-requested-With, Accept');
    next();
}

router.use(allowCrossDomain);


/* =========== BOARD FUNCTIONS ================= */

/* GET ALL BOARDS */
router.get('/', function(req, res, next) {
	console.log('getting all boards');
			Board.find( {$or:[{"author": req.session.user.username} , {"members": req.session.user.username}] },
			function (err, board){
		if (err){console.log(err);} 
		else{
			res.json(board);
			console.log(board);
		}
	});
});

/* GET ONE BOARD */
router.get('/:id',  function(req, res) {
	console.log('getting one board');
	Board.findOne({_id: req.params.id}, function(err, board){
		if (err){console.log(err);} 
		else{
			res.json(board.lists);
			console.log(board.lists);
		}
	});
});

/* POST  */
router.post('/', function (req,res) {
	console.log('posting board');
	var newboard = new Board({ 
		"title": req.body.title,
		"author": req.session.user.username });
	newboard.save( function (err) {
  		if (err){console.log(err);} 
  		else{
  			console.log(newboard);
  			res.json(newboard);
  		}
	});
});


/* PATCH */
router.patch('/:id', function(req,res){
	console.log('patching board');
	Board.findOneAndUpdate(
		{'_id': req.params.id}, 
		{$set: {"title":req.body.title}},
		{safe:true, upsert:true},
		function(err, board){
			if (err){console.log(err);} 
			else{
			res.json(board);
			}
		});
});

/* DELETE  */
router.delete('/:id', function(req,res){
	console.log('deleting board');
	Board.findByIdAndRemove( req.params.id, function(err, board){
		if (err){console.log(err);} 
		res.send('deleted!');
	});
});

/* ========== LIST FUNCTIONS ============= */

/* POST A LIST */
router.post('/:id', function (req,res) {
	console.log('posting list');
	var newlist = new List({ "title": req.body.title });
	Board.findOne({_id: req.params.id}, function(err, board){
		if (err){console.log(err);} 
		else{
			board.lists.push(newlist);
			res.json(board);
			board.save();
			}
	});
});

/* DELETE A LIST */
router.delete('/:id/list/:listid', function(req,res){
	console.log('deleting list');
	Board.findOne({'_id': req.params.id}, function(err, board){
		if (err){console.log(err);} 
		else{
			for (var i = 0; i < board.lists.length; i++) {
				if(board.lists[i]._id == req.params.listid){
					board.lists.splice(i,1);
				}
			}
			board.save();
			res.json(board);
		}
	});
});


/* ========== CARD FUNCTIONS ============= */


/* POST A CARD */
router.post('/:boardid/list/:listid', function(req, res){
	console.log('posting card');
	Board.findOne({'_id': req.params.boardid}, function(err, board){
		if(err){console.log(err);}
		else{
			for(var i = 0; i < board.lists.length; i++){
				if(board.lists[i]._id == req.params.listid){
					var newcard = new Card({
						"description": req.body.description,
						"title": req.body.title
					});
					if(req.body.comment != ""){
						newcard.comments.push(req.body.comment + " // " + req.session.user.username + " // " + Date() );
					}
					board.lists[i].cards.push(newcard);
					board.markModified("lists");
				}
			}

			board.save(function(err2, board2){
				if(err2){console.log(err2);}
				res.json(board2);
			});
		}

	});
});

/* PATCH A CARD */
router.patch('/:id/list/:listid/card/:cardid', function(req,res){
	console.log('patching card');
	Board.findOne({'_id': req.params.id}, function(err, board){
		if (err){console.log(err);} 
		else{
			for (var i = 0; i < board.lists.length; i++) {
				if(board.lists[i]._id == req.params.listid){
					
					for(var j = 0; j < board.lists[i].cards.length; j++){
						if(board.lists[i].cards[j]._id == req.params.cardid){
							var thiscard = board.lists[i].cards[j];
							thiscard.description = req.body.description;
							thiscard.title = req.body.title;
							if(req.body.comment != ""){
								console.log(req.body.comment + " // " + req.session.user.username + " // " + Date());
								thiscard.comments.push(req.body.comment + " // " + req.session.user.username + " // " + Date() );
							}
							board.markModified("lists");
						}
					}
				}
				
			}
			board.save(function(err2, board2){
				if(err2){console.log(err2);}
				res.json(board2);
			});
		}
		
	});
});

/* DELETE A CARD */
router.delete('/:id/list/:listid/card/:cardid', function(req,res){
	console.log('deleting card');
	Board.findOne({'_id': req.params.id}, function(err, board){
		if (err){console.log(err);} 
		else{
			for (var i = 0; i < board.lists.length; i++) {
				if(board.lists[i]._id == req.params.listid){
					
					for(var j = 0; j < board.lists[i].cards.length; j++){
						if(board.lists[i].cards[j]._id == req.params.cardid){

							board.lists[i].cards.splice(j,1);
							board.markModified("lists");
						}
					}
				}
				
			}
			board.save(function(err2, board2){
				if(err2){console.log(err2);}
				res.json(board2);
			});
		}
		
	});
});



/* ========== COMMENT FUNCTIONS ============= */

/* POST A COMMENT */
router.post('/:boardid/list/:listid/card/:cardid', function(req, res){
	console.log('posting comment');
	Board.findOne({'_id': req.params.boardid}, function(err, board){
		if(err){console.log(err);}
		else{
			for(var i = 0; i < board.lists.length; i++){
				if(board.lists[i]._id == req.params.listid){
					var newcard = new Card({
						"description": req.body.description,
						"title": req.body.title
					});
					if(req.body.comment != ""){
						newcard.comments.push(req.body.comment + " // " + " // " + Date() );
					}
					board.lists[i].cards.push(newcard);
					board.markModified("lists");
				}
			}

			board.save(function(err2, board2){
				if(err2){console.log(err2);}
				res.json(board2);
			});
		}

	});
});




module.exports = router;