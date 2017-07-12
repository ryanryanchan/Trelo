var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Log In', href: 'stylesheets/login.css'});
});

router.get('/test',function(req,res){
	res.send('hihihih');
});

module.exports = router;