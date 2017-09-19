var mongoose = require('mongoose');


/* Cart Schema */

var OrderSchema = mongoose.Schema({

	title: {
		type: String,																													
		required: true
	},

	qty: {
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


var Orders = module.exports = mongoose.model('Orders', OrderSchema);


