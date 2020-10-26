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

let News = mongoose.model('News', NewsSchema);

module.exports = News;
