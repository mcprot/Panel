let mongoose = require('mongoose');

let PlanSchema = new mongoose.Schema({
    connections: Number,
    price: Number,
    name: String,
    targets: Number,
    custom: {
        type: Boolean,
        default: false
    }
});

let Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
