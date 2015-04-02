var exphbs = require('express-handlebars');
var url = require('url');
exports.hbsconfig = function() {

    var hbs = exphbs.create({
        helpers: {
            select: function(value, options) {
                return options.fn(this)
                    .split('\n')
                    .map(function(v) {
                        var t = 'value="' + value + '"'
                        return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
                    })
                    .join('\n')
            }
        },
        defaultLayout: 'main',
        extname: '.html',
        partialsDir: 'views/partials'
    });
    return hbs;
}
