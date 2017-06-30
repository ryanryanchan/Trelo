var mongoose = require('mongoose');

var schema = mongoose.Schema('card', 
		{
			description: String
		}
	);

module.exports = mongoose.model('card', schema);