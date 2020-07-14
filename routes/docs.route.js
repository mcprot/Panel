let express = require('express');
let router = express.Router();

router.get('/faq', function (req, res, next) {
    return res.render("docs_faq", {title: 'Docs | FAQ'});
});

module.exports = router;