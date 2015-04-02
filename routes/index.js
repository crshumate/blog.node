var app = require('../app');
var express = require('express');
var router = express.Router();
var posts = require('../controllers/postsController');

/* GET home page. */
router.get('/', posts.index);

//Tell the app to use the routes
app.use('/', router);

