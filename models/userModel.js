var mongoose = require('mongoose'),
    validate = require('mongoose-validator');
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require('crypto');

/*===Basic Schema==*/
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        validate: [validate({
            validator:"isLength",
            arguments:1,
            message: 'Username cannot be blank'
        })]
    },
    email: {
        type: String,
        validate: [validate({
            validator:"isEmail",
            message: 'Must enter valid email address'
        })]
    },
    password: {
        type: String,
        validate: [validate({
            validator:"isLength",
            arguments:1,
            message: 'Password cannot be blank'
        })]
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

UserSchema.statics = {
    salt: "3d8DFIJKGS3567bt0fjtbskfgjJDSHS6rHHSSQ13909092jvbCxsfbZZZ12AGGHFHFGDGDS1234f987fd"
}

UserSchema.methods = {
    encryptPassword: function(password) {
        return crypto.createHmac('sha512', UserSchema.statics.salt).update(password).digest('hex');
    },
    validPassword:function(pwd){
        return (this.password === UserSchema.methods.encryptPassword(pwd)); 
    }

}

UserSchema.pre('save', function(next) {
    if (typeof this.password === 'string') {

        this.password = UserSchema.methods.encryptPassword(this.password);
    }
    next();
})


var UserModel = mongoose.model('users', UserSchema);
UserModel.encryptPassword = UserSchema.methods.encryptPassword;
UserModel.resetpw = function() {
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

UserModel.emails = {};
UserModel.emails.resetpw = function(res, user, newpw) {
    res.mailer.send('emails/forgot_password', {
        to: user.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
        subject: 'Password Reset', // REQUIRED.
        username: user.username,
        password: newpw
    }, function(err) {
        if (err) {
            console.log('error',err)
            return 'error';
        }
        console.log('success');
        return 'success';
    });
};
