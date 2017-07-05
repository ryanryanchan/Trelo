var mongoose = require('mongoose');

var schema = mongoose.Schema( 
		{
			username: String,
			email: String,
			password: String
		}
	);


module.exports = mongoose.model('user', schema);