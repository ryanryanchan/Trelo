
var Board = require('./models/board');

permission = function(req, res, next){
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
			next();
		}
	});
};

module.exports = permission;