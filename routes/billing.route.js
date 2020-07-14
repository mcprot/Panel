let express = require('express');
let router = express.Router();

router.get('/plans', function (req, res, next) {
    return res.render("billing_plans", {title: 'Billing | Plans'});
});

module.exports = router;