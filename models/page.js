var mongoose = require('mongoose');


/* Page Schema */

var PageSchema = mongoose.Schema({

	title: {
		type: String,
		required: true
	},

	sub: {
		type: String
		
	},
	
	content: {
		type: String,
		required: true
	},
	
	sorting: {
		type: Number
		
	}


});


var Page = module.exports = mongoose.model('Page', PageSchema);


