var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', href: 'stylesheets/board.css'});
});

router.get('/test',function(req,res){
	res.send('hihihih');
});

module.exports = router;