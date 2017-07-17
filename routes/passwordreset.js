var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  res.render('link', { title: 'Password reset link',
  				
  				link: req.params.id});
});

router.get('/reset/:hashcode', function(req, res, next) {
  res.render('change', { title: 'Password reset link',
  				
  				code: req.params.hashcode});
});
module.exports = router;