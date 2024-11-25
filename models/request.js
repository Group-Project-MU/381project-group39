var mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	userid: {type: String},
	postcode: {type: String, require: true},
	date: {type: String, require: true},
	name: {type: String, require: true},
	age: {type: Number, require: true},
	num: {type:Number, require: true},
	comment: {type: String}	,
	location: {type:[String], require: true},
    file: {type: String},
    message: [{locx: String,
                locy: String,
                rad: String,
                msg: String
                }]
});

module.exports = RequestSchema;
