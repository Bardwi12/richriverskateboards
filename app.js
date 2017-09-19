var express = require('express');
var partials = require('express-partials');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var regex = require("regex");
var csrf = require('csurf');
var MongoStore = require('connect-mongo')(session);
var nodemailer = require("nodemailer");
var sendGrid = require('sendgrid')(process.env.U, process.env.PASSWORD);


var mongoose = require('mongoose');
mongoose.connect('mongodb://*****:*******.mlab.com:****/richriver');

/*Init app */
var app = express();

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Setting Public folder */
app.use(express.static(path.join(__dirname, 'public')));

/* Set global errors variable */
app.locals.errors = null;


/* Get Page Model  */
var Page = require('./models/page');


/* Get all pages to pass to header.ejs */
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});

/* Get category Model */

var Category = require('./models/category');

/* Get all categories to pass to header.ejs */
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});

var Cart = require('./models/cart');
var Product = require('./models/product');

Product.find(function (err, p) {
        if (err){
            console.log(err);

        } else {
            
            app.locals.products = products;
            } 
          });   
        


/* Express fileUpload middleware  */
app.use(fileUpload());


/* Body-parser middleware  */
/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }))

/* parse application/json  */
app.use(bodyParser.json());



/* Express session middleware */
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(csrf());
app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token; 
  next();
});


/* Express Validator middleware  */
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  customValidators: {
        isImage: function (value, filename) {
          var extension = (path.extname(filename)).toLowerCase();
          switch (extension) {
            case '.jpg':
               return '.jpg';
            case '.jpeg':
               return '.jpeg';
            case '.png':
               return '.png';
            case '':
               return '.jpg';
            default:
               return false;
          }
        }

     }
}));



/*  Express Messages middleware  */
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use(function(req, res, next){
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});






/*   Passport Config   */
require('./config/passport')(passport);
/* Passport Middleware  */
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next) {
   res.locals.cart = req.session.cart;
   res.locals.user = req.user || null;
   next();
});

app.get('/', function(req, res, next) {
 
  res.render('home', { title: 'Richriver' });
 
});

app.get('/shop', function(req, res, next) {
 
  res.render('shop', { title: 'Shop' });
 
});




app.get('/contact', function(req, res, next) {
 
  res.render('contact', { title: 'Contact' });
 
});






/*  Set routes  */
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var users = require('./routes/users.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');



app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', pages);




/*   Start the server */
var port = 5000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});








