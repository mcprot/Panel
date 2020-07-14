let express = require('express');
let router = express.Router();

router.get('/servers', function (req, res, next) {
    return res.render("admin/servers", {title: 'Admin | Servers'});
});

router.get('/analytics', function (req, res, next) {
    return res.render("admin/analytics", {title: 'Admin | Analytics'});
});



module.exports = router;