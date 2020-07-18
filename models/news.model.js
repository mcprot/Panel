let mongoose = require('mongoose');

let NewsSchema = new mongoose.Schema({
    date: Date,
    title: String,
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    content: String
});

let NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;
