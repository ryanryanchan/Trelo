var mongoose = require('mongoose');

var schema = mongoose.Schema( 
		{
			title: String,
			lists: Array,
			author: String,
			members: Array
		}
	);


module.exports = mongoose.model('board', schema);