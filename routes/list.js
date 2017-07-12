var express = require('express');
var router = express.Router();

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


/* GET */
router.get('/', function(req, res) {
	List.find(function (err, list){
		if (err){console.log(err);} 
		else{
			res.json(list);
			console.log(list);
		}
	});
});

router.get('/:id', function(req, res) {
	List.findOne({_id: req.params.id}, function(err, list){
		if (err){console.log(err);} 
		else{
			res.json(list);
			console.log(list);
		}
	});
});


/* POST  */
router.post('/', function (req,res) {

	var newlist = new List({ "title": req.body.title });
	newlist.save( function (err) {
  		if (err){console.log(err);} 
  		else{
  			console.log(newlist);
  			res.json(newlist);
  		}
	});
	console.log(req.body);
});

router.post('/:id', function(req, res){
	console.log('posting card');
	var newcard = new Card({
		"description": req.body.description,
		"title": req.body.title
	});
	if(req.body.comment != ""){
		newcard.comments.push(req.body.comment + " // " + req.session.user.username + " // " + Date() );
	}

	List.findOne({_id: req.params.id}, function(err, list){
		if (err){console.log(err);} 
		else{
			list.cards.push(newcard);
			list.save();
			res.json(list);
		}
	});
});

router.post('/:listid/card/:cardid',function(req,res){
	List.findOne({'_id': req.params.listid}, function(err, list){
		if (err){console.log(err);} 
		else{
			for(i = 0; i < list.cards.length; i++){
				if(list.cards[i]._id == req.params.cardid){
					console.log('PLEASE');
					if(req.body.comment != ""){
						list.cards[i].comments.push(req.body.comment + " // " + req.session.user.username + " // " + Date() );
					}
					list.markModified("cards");
				}
			}
			list.save(function(err2, list2){
				if (err2){console.log(err2);} 
				res.json(list2);
			});
			
		}
	});
});


/* PATCH */
router.patch('/:id',function(req,res){
	List.findOneAndUpdate(
		{'_id': req.params.id}, 
		{$set: {"title":req.body.title}},
		{safe:true, upsert:true},
		function(err, list){
			if (err){console.log(err);} 
			else{
			res.json(list);
			}
		});
});

router.patch('/:listid/card/:cardid',function(req,res){
	List.findOne({'_id': req.params.listid}, function(err, list){
		if (err){console.log(err);} 
		else{
			for(i = 0; i < list.cards.length; i++){
				if(list.cards[i]._id == req.params.cardid){
					console.log(req.body.description);
					list.cards[i].description = req.body.description;
					list.cards[i].title = req.body.title
					if(req.body.comment != ""){
						console.log(req.body.comment);
						var c = req.body.comment + " // " + req.session.user.username + " // " + Date() 
						list.cards[i].comments.push( c );
					}
					list.markModified("cards");
				}
			}
			list.save(function(err2, list2){
				if (err2){console.log(err2);} 
				res.json({"comment": c});
			});
			
		}
	});
});



router.patch('/:listid/card/:cardid/label',function(req,res){
	List.findOne({'_id': req.params.listid}, function(err, list){
		if (err){console.log(err);} 
		else{
			for(i = 0; i < list.cards.length; i++){
				if(list.cards[i]._id == req.params.cardid){
					console.log('PLEASE');
					list.cards[i].labels.push(req.body.label);
					list.markModified("cards");
				}
			}
			list.save(function(err2, list2){
				if (err2){console.log(err2);} 
				res.json(list2);
			});
			
		}
	});
});


/* DELETE  */
router.delete('/:id', function(req,res){
	List.findByIdAndRemove( req.params.id, function(err, list){
		if (err){console.log(err);} 
		res.send('deleted!');
	});
});


router.delete('/:listid/card/:cardid', function(req,res){
	List.findOne({'_id': req.params.listid}, function(err, list){
		if (err){console.log(err);} 
		else{
			for (var i = 0; i < list.cards.length; i++) {
				if(list.cards[i]._id == req.params.cardid){
					list.cards.splice(i,1);
				}
			}
			list.save();
			res.json(list);
		}
	});
});




module.exports = router;