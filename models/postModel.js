var mongoose = require('mongoose'),
    validate = require('mongoose-validator');


/*===Basic Schema==*/
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type: String,
        validate: [validate({
            validator: "isLength",
            arguments: 1,
            message: 'Title cannot be blank'
        })]
    },
    body: {
        type: String,
        validate: [validate({
            validator: "isLength",
            arguments: 1,
            message: 'Body cannot be blank'
        })]
    },
    slug: {
        type: String,
    },
    categories: {
        type: []
    },
    type: {
        type: String,

    },
    created: {
        type: Date,
        default: Date.now
    }
});




var PostModel = mongoose.model('posts', PostSchema);
