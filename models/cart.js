var mongoose = require('mongoose');


/*  Cart Schema  */

var CartSchema = mongoose.Schema({

	title: {
		type: String,
		required: true
	},

	qty: {
		type: String
		
	},
	
	price: {
		type: Number,
		required: true
		
	},

	image: {
		type: String
		
	}



});


var Cart = module.exports = mongoose.model('Cart', CartSchema);


