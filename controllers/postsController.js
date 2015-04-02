var mongoose = require('mongoose');
var PostModel = mongoose.model('posts');
var CategoriesModel = mongoose.model('categories');
var ImageModel = mongoose.model('images');
var services = require('../services/services');
var returnErrors = services.services.errors.returnErrors;

exports.index = function(req, res) {

    var alerts = req.flash('info');

    PostModel.find({}, '', {
        sort: {
            created: -1
        }
    }, function(err, posts) {
        if (!err) {
            res.render('posts/index', {
                title: 'Posts',
                posts: posts,
                alerts: alerts
            });
        } else {
            return console.log(err);
        }
    });


};


exports.create = function(req, res) {
    var alerts = req.flash('info');
    var image_list;

    if (req.method === 'GET') {

        ImageModel.find({}, 'title image thumbnail -_id', function(err, images) {
            if (!err) {
                image_list = images;

            } else {
                image_list = null;
            }
            res.render('posts/create', {
                title: 'Add New Post',
                alerts: alerts,
                images: image_list
            });
        });

    } else if (req.method === 'POST') {
        var slug = req.body.title.replace(/\s+/g, '-').toLowerCase(),
            cats = req.body.categories.split(","),
            categories = [];

        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            if (cat.length > 0) {
                categories.push(cat.toLowerCase().trim());
            }

        }


        post = new PostModel({
            title: req.body.title,
            body: req.body.body,
            type: req.body.type,
            slug: slug,
            categories: categories

        });

        post.save(function(err) {
            if (!err) {
                req.flash('info', {
                        type: "success",
                        message: "Post created"
                    })
                    //Save your categories foo!
                for (var i = 0; i < categories.length; i++) {

                    var category = categories[i];
                    CategoriesModel.update({
                        category: category
                    }, {
                        category: category
                    }, {
                        upsert: true
                    }, function() {});
                }

                res.redirect('/blog');

            } else {

                req.flash('info', returnErrors(err));
                res.redirect('/blog/create');
            }
        });

    }


};


exports.edit = function(req, res) {
    var alerts = req.flash('info');
    if (req.method === 'GET') {
        PostModel.findOne({
            "slug": req.params.slug
        }, function(err, post) {
            if (!err) {
                var image_list;
                ImageModel.find({}, 'title image thumbnail -_id', function(err, images) {
                    if (!err) {
                        image_list = images;

                    } else {
                        image_list = null;
                    }
                    res.render('posts/edit', {
                        title: 'Edit Post',
                        post: post,
                        alerts: alerts,
                        images: image_list

                    });
                });

            } else {
                return console.log(err);
            }
        });


    }
    if (req.method === 'POST') {

        PostModel.findOne({
            "slug": req.params.slug
        }, function(err, post) {
            var slug = req.body.title.replace(/\s+/g, '-').toLowerCase();

            cats = req.body.categories.split(","),
                categories = [];

            for (var i = 0; i < cats.length; i++) {
                var cat = cats[i];
                if (cat.length > 0) {
                    categories.push(cat.toLowerCase().trim());
                }

            }

            post.title = req.body.title;
            post.body = req.body.body;
            post.slug = slug;
            post.type = req.body.type;
            post.categories = categories;


            post.save(function(err) {
                if (!err) {
                    req.flash('info', [{
                        type: "success",
                        message: "Post Updated"
                    }]);

                    //Save your categories foo!
                    for (var i = 0; i < categories.length; i++) {

                        var category = categories[i];
                        CategoriesModel.update({
                            category: category
                        }, {
                            category: category
                        }, {
                            upsert: true
                        }, function() {});
                    }
                    res.redirect('/blog');
                } else {

                    req.flash('info', returnErrors(err));
                    res.redirect('/blog/edit/' + req.params.slug);


                }
            });
        });
    }


};

exports.view = function(req, res) {
    var alerts = req.flash('info');
    PostModel.findOne({
        "slug": req.params.slug
    }, function(err, post) {
        if (!err) {
            res.render('posts/view', {
                title: post.title,
                post: post,
                alerts: alerts
            });
        } else {
            return console.log(err);
        }
    });
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


exports.resetpw = function(req, res) {
    var alerts = req.flash('info');
    if (req.method === 'GET') {

        res.render('users/forgot_password', {
            title: 'Password Recovery',
            alerts: alerts
        });

    } else if (req.method === 'POST') {
        var newpw = UserModel.resetpw();

        UserModel.findOne({
            'email': req.body.email
        }, function(err, user) {
            console.log('USER', user);
            user.password = newpw;
            if (!err) {
                //save user 
                user.save(function(err) {
                    if (!err) {
                        //send email
                        var result = UserModel.emails.resetpw(res, user, newpw);
                        if (result === 'error') {
                            req.flash('info', {
                                type: "danger",
                                message: "There was an error sending the email"
                            });
                            res.redirect('/users/forgot_password');
                        }
                        req.flash('info', {
                            type: "success",
                            message: 'Email Sent'
                        });
                        res.redirect('/users/forgot_password');
                    } else {
                        console.log(err);
                        req.flash('info', {
                            type: "danger",
                            message: "Unable to Save User"
                        });
                        res.redirect('/users/forgot_password');
                    }
                });

            } else {
                req.flash('info', {
                    type: "danger",
                    message: "User could not be found"
                });
                res.redirect('/users/forgot_password');
            }
        });

    }

};
