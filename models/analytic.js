let mongoose = require('mongoose');

let AnalyticSchema = new mongoose.Schema({
    proxy_id: {
        type: mongoose.ObjectId,
        ref: 'Proxy',
        required: true
    },
    connections: {
        type: Map,
        default: {}
    }
});

let Analytic = mongoose.model('Analytic', AnalyticSchema);

module.exports = Analytic;
