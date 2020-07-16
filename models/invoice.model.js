let mongoose = require('mongoose');

let InvoiceSchema = new mongoose.Schema({
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    },
    plan: {
        type: mongoose.ObjectId,
        ref: 'Plan',
        required: true
    },
    proxy_id: {
        type: mongoose.ObjectId,
        ref: 'Proxy',
        required: true
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    stripe_id: {
        type: String,
        required: true
    }
});

let InvoiceModel = mongoose.model('Invoice', InvoiceSchema);

module.exports = InvoiceModel;
