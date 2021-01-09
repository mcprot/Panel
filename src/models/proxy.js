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
        allowVpn: {
            type: Boolean,
            default: false
        },
        allowBots: {
            type: Boolean,
            default: false
        },
        doLimbo: {
            type: Boolean,
            default: false
        }
    }
});

let Proxy = mongoose.model('Proxy', ProxySchema);

module.exports = Proxy;
