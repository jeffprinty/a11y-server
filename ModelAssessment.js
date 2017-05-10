'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AssessmentSchema = new Schema({
 text: String,
 checkValues: Object
});
//export our module to use in server.js
module.exports = mongoose.model('Assessment', AssessmentSchema);
