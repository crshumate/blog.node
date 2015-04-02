var mongoose = require('mongoose');
var UserModel = mongoose.model('users');
var passport = require('passport');
var services = require('../services/services');
var returnErrors = services.services.errors.returnErrors;

exports.users = function(req, res) {
    
    var alerts = req.flash('info');

    UserModel.find(function(err, users) {
        if (!err) {
            res.render('users/users', {
                title: 'All Users',
                users: users,
                alerts: alerts
            });
        } else {
            return console.log(err);
        }
    });
};

exports.create = function(req, res) {
    var alerts = req.flash('info');

    if (req.method === 'GET') {
        res.render('users/create', {
            title: 'Add New User',
            alerts: alerts
        });

    } else if (req.method === 'POST') {
        user = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        user.save(function(err) {
            if (!err) {
                req.flash('info', {
                    type: "success",
                    message: "User created"
                })
                res.redirect('/users/create');

            } else {

                req.flash('info', returnErrors(err));
                res.redirect('/users/create');
            }
        });
    }


}


exports.login = function(req, res) {
    var error = req.flash('error');
    var alert = [{
        type: 'danger',
        message: error

    }]
    res.render('users/login', {
        title: 'Users Index page!',
        alerts: alert
    });
};

exports.edit = function(req, res) {
    var alerts = req.flash('info');
    if (req.method === 'GET') {
        UserModel.findOne({
            "username": req.params.username
        }, function(err, user) {
            if (!err) {
                res.render('users/edit', {
                    title: 'Edit Page',
                    user: user,
                    alerts: alerts
                });
            } else {
                return console.log(err);
            }
        });


    }
    if (req.method === 'POST') {

        UserModel.findOne({
            "username": req.params.username
        }, function(err, user) {
            if (req.body.password) {
                var encrypted_pw = UserModel.encryptPassword(req.body.password);
                if (encrypted_pw === user.password) {
                    user.password = req.body.newpassword;
                } else {
                    req.flash('info', {
                        type: "danger",
                        message: "Current password does not match entered Old Password"
                    });
                    return res.redirect('/users/edit/' + req.params.username);
                }
            } else {
                user.username = req.body.username;
                user.email = req.body.email;
            }


            user.save(function(err) {
                if (!err) {
                    req.flash('info', [{
                        type: "success",
                        message: "User Updated"
                    }]);
                    res.redirect('/users/all');
                } else {

                    req.flash('info', returnErrors(err));
                    res.redirect('/users/edit/' + req.params.username);


                }
            });
        });
    }


};

exports.delete = function(req, res) {
    UserModel.findOneAndRemove(req.params.username, function(err, user) {
        if (!err) {
            req.flash('info', {type:"success", message:"User Deleted"})
            res.redirect('/users/all');
        } else {
            return console.log(err);
        }
    });

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
                    if(!err){
                        //send email
                        var result = UserModel.emails.resetpw(res, user, newpw);
                        if (result === 'error') {
                            req.flash('info', {type:"danger", message:"There was an error sending the email"});
                            res.redirect('/users/forgot_password');
                        }
                        req.flash('info', {type:"success",message:'Email Sent'});
                        res.redirect('/users/forgot_password');
                    }else{
                      console.log(err);
                        req.flash('info', {type:"danger", message:"Unable to Save User"});
                        res.redirect('/users/forgot_password');
                    }
                });

            } else {
                req.flash('info', {type:"danger", message:"User could not be found"});
                res.redirect('/users/forgot_password');
            }
        });

    }

};
