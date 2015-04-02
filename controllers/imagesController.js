var mongoose = require('mongoose');
var ImageModel = mongoose.model('images');
var services = require('../services/services');
var returnErrors = services.services.errors.returnErrors;
var fs = require('fs');
var easyimg = require('easyimage');

/*var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path'); //used for file path
var fs = require('fs-extra'); //File System - for file manipulation*/


exports.index = function(req, res) {

    var alerts = req.flash('info');

    ImageModel.find({}, '', {
        sort: {
            created: -1
        }
    }, function(err, images) {
        if (!err) {
            res.render('images/index', {
                title: 'Images',
                images: images,
                alerts: alerts
            });
        } else {
            return console.log(err);
        }
    });


};

exports.upload = function(req, res) {
    var alerts = req.flash('info');

    if (req.method === 'GET') {
        res.render('images/create', {
            title: 'Image Upload',
            alerts: alerts
        });
    } else if (req.method === 'POST') {
        var fstream;

        req.pipe(req.busboy);
        var image_field;
        req.busboy.on('field', function(key, value){
            image_field = value;
        });
        req.busboy.on('file', function(fieldname, file, filename) {
            //Path where image will be uploaded
            var image_path = 'public/img/' + filename;
            var thumb_name = 'thumb_' + filename;
            fstream = fs.createWriteStream(image_path);
            file.pipe(fstream);
            fstream.on('close', function() {

                //Create thumbnail
                easyimg.rescrop({
                    src: './public/img/' + filename,
                    dst: './public/img/thumb/' + thumb_name,
                    width: 100,
                    height: 100,
                    cropwidth: 100,
                    cropheight: 100,
                    x: 0,
                    y: 0
                }).then(
                    function(image) {
                        var image = new ImageModel({
                            title: image_field,
                            image: filename,
                            thumbnail: thumb_name
                        });

                        image.save(function(err) {
                            if (!err) {
                                req.flash({
                                    type: "success",
                                    message: "Image successfully uploaded"
                                })
                                res.redirect('/images/all'); //where to go next
                            } else {
                                req.flash('info', returnErrors(err));
                                res.redirect('/images/upload');
                            }
                        });
                    },
                    function(err) {
                        console.log("HERE",err);
                    }
                );


            });
            fstream.on('error', function(err) {
                console.log(err);
            });



        });
    }


};



exports.delete = function(req, res) {
    var alerts = req.flash('info');
    if (req.method === 'GET') {

        PostModel.findOne({
            "slug": req.params.slug
        }, function(err, post) {
            if (!err) {
                res.render('posts/delete', {
                    title: 'Delete Post',
                    post: post,
                    alerts: alerts
                });
            } else {
                return console.log(err);
            }
        });
    } else if (req.method === 'POST') {
        PostModel.findOneAndRemove(req.params.slug, function(err, user) {
            if (!err) {
                req.flash('info', {
                    type: "success",
                    message: "Post Deleted"
                })
                res.redirect('/blog');
            } else {
                return console.log(err);
            }
        });
    }


};


