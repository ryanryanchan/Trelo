var express = require('express');
var router = express.Router();

var hash = require('object-hash');

var User = require('../models/user');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-requested-With, Accept');
    next();
}

router.use(allowCrossDomain);


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, user){
  	if (err){console.log(err);} 
		else{
			res.json(user);
			console.log(user);
		}
	});
});

router.get('/:id', function(req, res) {
	User.findOne({_id: req.params.id}, function(err, user){
		if (err){console.log(err);} 
		else{
			res.json(user);
			console.log(user);
		}
	});
});

/* POST  */
router.post('/', function (req,res) {

	var newuser = new User(
		{ 
			"username": req.body.username,
			"email": req.body.email,
			"password": hash(req.body.password),
			"reset": Date()
			});


	newuser.save( function (err) {
  		if (err){console.log(err);} 
  		else{
  			console.log(newuser);
  			res.json(newuser);
  		}
	});
	console.log(req.body);
});

/* PATCH  */

router.patch('/:code', function(req,res){
	User.find(function(err, user){
		for(var i = 0; i < user.length; i++){
			var hasheduser = hash(user[i].username + user[i].reset);
			if( hasheduser == req.params.code){
				var pw = hash(user[i].password);
				user[i].password = pw;

				console.log(user);
				
				res.json(user);
			}
		}
	});

});

/* DELETE */

router.delete('/:id', function(req,res){
	User.findByIdAndRemove( req.params.id, function(err, user){
		if (err){console.log(err);} 
		else{
			res.send('deleted!');
		}
	});
});


module.exports = router;
