var app = require('../app');
var errors = require('./errors');
exports.services = {

    authenticated: function(req,res, next) {
            if (req.user) {
                app.locals.user=req.user;
                next();
            } else {
                app.locals.user=null;
                res.redirect('/users/login');
            }
        
    },

    errors:errors

}
