var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	username: {type: String, required: true},
	password: {type: String, required: true, minlength:8},
	email: {type: String, required: true},
	phonenum: {type: String, required: true,minlength:8, maxlength:8}
});

module.exports = accountSchema;
