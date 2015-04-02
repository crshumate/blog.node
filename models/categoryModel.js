var mongoose = require('mongoose'),
    validate = require('mongoose-validator');


/*===Basic Schema==*/
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    category: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});




var CategoryModel = mongoose.model('categories', CategorySchema);

