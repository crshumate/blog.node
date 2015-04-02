var mailer = require('express-mailer');
var app = require('../app');

//exports.config = function() {
mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'localhost', // hostname
    secureConnection: true, // use SSL
    transportMethod: 'Sendmail' // default is SMTP. Accepts anything that nodemailer accepts

});
//}
