const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	IPs: [{
		type: String,
		require: true
	}],
	Cart: [{
		type: String,
		require: true
	}]
});

let users = module.exports = mongoose.model('users', userSchema);