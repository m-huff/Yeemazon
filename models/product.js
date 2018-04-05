const mongoose = require('mongoose');

let productSchema = mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	price: {
		type: String,
		require: true
	},
	link: {
		type: String,
		require: true
	},
	keywords: [{
		type: String
	}]
});

let Poduct = module.exports = mongoose.model('Product',productSchema);