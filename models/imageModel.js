var mongoose = require('mongoose'),
    validate = require('mongoose-validator');


/*===Basic Schema==*/
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    title: {
        type: String,
        validate: [validate({
            validator: "isLength",
            arguments: 1,
            message: 'Image title required'
        })]
    },
    image: {
        type: String,
        validate: [validate({
            validator: "isLength",
            arguments: 1,
            message: 'Must upload image'
        })]
    },
    thumbnail: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
});




var ImageModel = mongoose.model('images', ImageSchema);
