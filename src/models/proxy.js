let mongoose = require('mongoose');

let ProxySchema = new mongoose.Schema({
    targets: [{type: String}],
    hostname: String,
    plan: String,
    expiry: Date,
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    options: {
        type: Map,
        default: {}
    }
});

let Proxy = mongoose.model('Proxy', ProxySchema);

module.exports = Proxy;
