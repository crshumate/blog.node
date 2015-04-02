var app = require('../app');
var express = require('express');
var router = express.Router();
var posts = require('../controllers/postsController');
var services = require('../services/services');




router.get('/',  posts.index);
router.get('/post/:slug', posts.view);

router.get('/create', posts.create);
router.post('/create', posts.create);
router.get('/delete/:slug', posts.delete);
router.post('/delete/:slug', posts.delete);
router.get('/edit/:slug', posts.edit);
router.post('/edit/:slug', posts.edit);

//Tell app to use assigned routes for /blog path
app.use('/blog', router);