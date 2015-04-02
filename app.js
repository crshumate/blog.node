    var flash = require('connect-flash');
var express = require('express');
var connect = require('connect');
var session = require('express-session');
var path = require('path');
var MongoStore = require('connect-mongo')(session);
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var busboy = require('connect-busboy'); //middleware for form/file upload
var fs = require('fs');

var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mailer = require('express-mailer');

//make app available through entire application by adding module.exports here..
var app = module.exports = express();
//include db configuration
require('./configs/db');


//models
require('./models/models');

//passport configs
require('./configs/passport');


//email configs
var email = require('./configs/email');

var hbs = require('./configs/handlebars');
hbs = hbs.hbsconfig();

app.engine('html', hbs.engine);
app.set('view engine', 'html');
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(busboy());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: "d46ts27g",
    saveUninitialized: true,
    resave: true,
    name: "app.sess",
    maxAge: 24 * 360000 * 7,
    store: new MongoStore({
        db: 'll',
        host: 'localhost',
        collection: 'sessions'
    })
}));

app.use(flash());

//Passport config
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, './public')));

//Set up routes
var routes = require('./routes/routes');
//module.exports = app;
