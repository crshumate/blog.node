var express = require('express');
var router = express.Router();
var users = require('../controllers/usersController');
var services = require('../services/services');
var app =require('../app');



/* GET users listing. */
router.get('/all', users.users);
router.get('/create',  users.create);
router.post('/create',   users.create);
router.get('/delete/:id', users.delete);
router.get('/edit/:username', users.edit);
router.post('/edit/:username', users.edit);
router.get('/forgot_password', users.resetpw);
router.post('/forgot_password', users.resetpw);

router.get('/login', users.login);
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: "Invalid username or password",
        successFlash: "Welcome!"
    })
);
router.get('/logout', function(req, res) {
    app.locals.user=false;
    req.logout();
    res.redirect('/');
});
//Tell to use assigned routes for /users path
app.use('/users', router);