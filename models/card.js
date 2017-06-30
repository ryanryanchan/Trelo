var mongoose = require('mongoose');

var schema = mongoose.Schema( 
		{
			description: String
		}
	);

module.exports = mongoose.model('card', schema);