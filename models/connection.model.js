let mongoose = require('mongoose');

let ConnectionSchema = new mongoose.Schema({
    proxy_id: {
        type: mongoose.ObjectId,
        ref: 'Proxy',
        required: true
    },
    version: Number,
    ip_address: String,
    date: Date,
    success: Boolean,
    forge: Boolean,
    server_id: {
        type: mongoose.ObjectId,
        ref: 'Server',
        required: true
    },
});

let ConnectionModel = mongoose.model('Connection', ConnectionSchema);

module.exports = ConnectionModel;
