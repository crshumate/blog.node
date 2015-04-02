//Database configs
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ll');
//add node-validator funcitonaltiy to mongoose
var validate = require('mongoose-validator').validate;
