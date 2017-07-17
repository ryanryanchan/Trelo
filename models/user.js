var mongoose = require('mongoose');

var schema = mongoose.Schema( 
		{
			username: String,
			email: String,
			password: String,
			reset: 0
		}
	);


module.exports = mongoose.model('user', schema);