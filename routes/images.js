var app = require('../app');
var express = require('express');
var router = express.Router();
var images = require('../controllers/imagesController');
var services = require('../services/services');



router.get('/all', images.index);
router.get('/upload',  images.upload);
router.post('/upload',  images.upload);
/*router.get('/delete/:id', images.delete);
router.post('/delete/:id', images.delete);*/

app.use('/images', router);