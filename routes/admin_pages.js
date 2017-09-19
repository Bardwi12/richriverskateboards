var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;


/*** Get Page model ***/
var Page = require('../models/page');




/***get pages index ***/
router.get('/', isAdmin, function (req, res) {
    Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
    	res.render('admin/pages', {
    		pages: pages
    	});

    });
});


/***get add page**/

router.get('/add-page', isAdmin, function (req, res){

	var title = "";
	var sub = "";
	var content = "";
    
    res.render('admin/add_page', {
    	title: title,
    	sub: sub,
    	content: content

    });

});

/***Post add-page**/

router.post('/add-page', function(req, res){

	req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('content', 'Content must have a value.').notEmpty();


	var title = req.body.title;
	var sub = req.body.sub.replace(/\s+/g, '-').toLowerCase();
	if (sub == "") 
      sub = title.replace(/\s+/g, '-').toLowerCase();
	var content = req.body.content;

    
    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
    	    errors: errors,
    	    title: title,
    	    sub: sub,
    	    content: content

        });
      } else {
      	  Page.findOne({sub: sub}, function (err, page) {
      	  	 if (page) {
      	  	 	req.flash('danger', 'Page sub exists, choose another.');
      	  	 	res.render('admin/add_page', {
    	            title: title,
    	            sub: sub,
    	            content: content

                });

      	  	 } else {
      	  	 	var page = new Page({
      	  	 		title: title,
      	  	 		sub: sub,
      	  	 		content: content,
      	  	 		sorting: 100
      	  	 	});
                 
                page.save(function (err) {
                	if (err)
                		return console.log(err);
                  Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                            if (err) {
                               console.log(err);
                             } else {
                                 req.app.locals.pages = pages;
                             }            
                          });
                	req.flash('success', 'Page added!');
                	res.redirect('/admin/pages');

                }) ;
      	  	 }
      	  });
      }

});


/***sort pages ***/

function sortPages(ids, callback){

var count = 0;

   for (var i = 0; i < ids.length; i++ ) {
       var id = ids[i];
       count++;
       

       (function(count) {

          Page.findById(id, function (err, page) {
             page.sorting = count;
             page.save(function (err) {
                if (err)
                   return console.log(err);
                  ++count;
                  if (count >= ids.length) {
                     callback();
              }   
    
          });
         
         });

      }) (count);

   }
 }

/***POST reorder pages***/

router.post('/reorder-pages', function (req, res) {
   var ids = req.body['id[]'];

    sortPages(ids, function() {
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
               console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
      });

     });

/**get edit page**/

router.get('/edit-page/:id', isAdmin, function (req, res) {

  Page.findById(req.params.id, function (err, page) {
       if (err) 
           return console.log(err);

    
    res.render('admin/edit_page', {
            title: page.title,
            sub: page.sub,
            content: page.content,
            id: page._id

    });

  });
});

/***post edit page***/

router.post('/edit-page/:id', function(req, res){

  req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('content', 'Content must have a value.').notEmpty();


  var title = req.body.title;
  var sub = req.body.sub.replace(/\s+/g, '-').toLowerCase();
  if (sub == "") 
    sub = title.replace(/\s+/g, '-').toLowerCase();
  var content = req.body.content;
  var id = req.params.id;
    
    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_page', {
          errors: errors,
          title: title,
          sub: sub,
          content: content,
          id: id

        });
      } else {
          Page.findOne({sub: sub, id:{ '$ne':id}}, function (err, page) {
             if (page) {
              req.flash('danger', 'Page sub exists, choose another.');
              res.render('admin/edit_page', {
                  title: title,
                  sub: sub,
                  content: content,
                  id: id

                });

             } else {


                Page.findById(id, function (err, page) {
                    if (err)
                       return console.log(err);

                     page.title = title;
                     page.sub = sub;
                     page.content = content;

                     page.save(function (err) {
                         if (err)
                             return console.log(err);
                           Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.pages = pages;
                            }
                        });


                    req.flash('success', 'Page edited!');
                    res.redirect('/admin/pages/edit-page/'+ id);
                });

                });
        
                 
                
             }
          });
      }

});


/**get delete page**/
router.get('/delete-page/:id', isAdmin, function (req, res) {
    Page.findByIdAndRemove(req.params.id, function(err){
      if (err) 
          return console.log(err);

        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                            if (err) {
                               console.log(err);
                             } else {
                                 req.app.locals.pages = pages;
                             }            
                          });


      req.flash('success', 'Page deleted!');
      res.redirect('/admin/pages/');

    

    });
});


/* Exports */
module.exports = router;
