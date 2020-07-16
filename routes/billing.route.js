let express = require('express');
let router = express.Router();

let Plan = require('../models/plan.model');

router.get('/plans', function (req, res, next) {
    Plan.find({custom: false}, function (err, plans) {
        return res.render("billing_plans", {
            title: "Billing | Plans",
            plans: plans,
        });
    }).sort({price: 1}).limit(4);
});

module.exports = router;