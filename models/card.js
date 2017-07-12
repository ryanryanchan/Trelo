var mongoose = require('mongoose');

var schema = mongoose.Schema( 
		{
			title: String,
			description: String,
			comments: Array,
			labels: Array
		}
	);

module.exports = mongoose.model('card', schema);