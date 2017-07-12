var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.session){
		req.session.reset();
	}
  res.redirect('/login');
});

module.exports = router;