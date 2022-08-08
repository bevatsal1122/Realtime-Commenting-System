const mongoose = require('mongoose');

const commetSchema = new mongoose.Schema({
    username: {type: String,  required: true},
    comment: {type: String,  required: true},
    date: {type: String,  required: true},
}, {timestamps: true});

const Comments = mongoose.model('Comments', commetSchema);

module.exports = Comments;
