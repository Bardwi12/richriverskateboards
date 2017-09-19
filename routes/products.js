var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser = auth.isUser;
var regex = require("regex");



/** Get Product model  **/
var Product = require('../models/product');

/** Get Category model  **/
var Category = require('../models/category');


/** Get all Products  **/

router.get("/", function (req, res) {
    

/**  router.get('/', isUser, function (req, res) {  **/
       if (req.query.search) {
        
           const regex = new RegExp(escapeRegex(req.query.search), 'gi');

             Product.find({"name": regex }, function (err, products) {
                if (err){
                    console.log(err);
                 }else{

                    res.render('all_products', {
                         title: 'All products',
                         products: products});
                          }
                      });
     }else{

    
    Product.find(function (err, products) {
           

        if (err){
            console.log(err);
        } else {
        

        res.render('all_products', {
            title: 'All products',
            products: products});
          }
       });
     }

  });


/** Get products by Category  **/

router.get('/:category', function (req, res) {

    var categorySub = req.params.category;

    Category.findOne({sub: categorySub}, function (err, c) {
        Product.find({category: categorySub}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });

});



/** Get product details  **/

router.get('/:category/:product', function (req, res) {

    var galleryImages = null;
    var loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({sub: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        }
    });

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



/* Exports */
module.exports = router;