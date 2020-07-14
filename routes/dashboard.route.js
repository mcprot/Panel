let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
    return res.render("dashboard", {title: 'Dashboard'});
});

module.exports = router;