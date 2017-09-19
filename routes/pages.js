var express = require('express');
var router = express.Router();



/**  Get Page model **/
var Page = require('../models/page');


/** Get method **/

router.get('/', function(req, res) {
    Page.findOne({sub: 'home'}, function (err, page){
    	if (err)
    		console.log(err);

    	
    		res.render('index', {
    			title: page.title,
    			content: page.content
    		});
    	
    });
});


/** Get a page method  **/

router.get('/:sub', function(req, res) {

    var sub = req.params.sub;

    Page.findOne({sub: sub}, function (err, page){
    	if (err)
    		console.log(err);

    	if (!page) {
    		res.redirect('/');
    	} else {
    		res.render('index', {
    			title: page.title,
    			content: page.content
    		});
    	}
    });

});




/* Exports */
module.exports = router;