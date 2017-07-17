var express = require('express');
var router = express.Router();

var hash = require('object-hash');

var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('forgot_password', { title: 'Forgot Password?'});
});

router.post('/', function(req,res,next){
	User.findOne({ email: req.body.email }, function(err, user) {
		console.log(req.body.email);
  	if (err){console.log(err);} 
    if (!user) {
    	console.log('not user');
      	res.status(500).send('user does not exist');
    } else {
		user.reset = Date();
    	var hasheduser = hash(user.username + user.reset );
    	user.save();
      	res.json(hasheduser);
    }
  });
});
module.exports = router;