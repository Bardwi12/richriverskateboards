var mongoose = require('mongoose');


/* Product Schema */

var ProductSchema = mongoose.Schema({

	title: {
		type: String,
		required: true
	},

	sub: {
		type: String
		
	},
	
	desc: {
		type: String,
		required: true
	},

	category: {
		type: String,
		required: true
	},
	
	price: {
		type: Number,
		required: true
		
	},

	image: {
		type: String
		
	}



});


var Product = module.exports = mongoose.model('Product', ProductSchema);


