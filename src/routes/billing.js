import {Router} from 'express';
let router = Router();

let Plan = require('../models/plan');

router.get('/plans', function (req, res, next) {
    Plan.find({custom: false}, (err, plans) => {
        return res.render("billing_plans", {
            title: "Billing | Plans",
            plans: plans,
        });
    }).sort({price: 1}).limit(4);
});

export default router;
