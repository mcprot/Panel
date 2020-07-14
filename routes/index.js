let express = require('express');
let router = express.Router();

router.use('/login', require('./login.route.js'));
router.use('/register', require('./register.route.js'));

/*router.use((req, res, next) => {
    if(req.user != null){
        next();
    }else{
        res.redirect('/login');
    }
});*/

router.get('/', function (req, res, next) {
    res.redirect('/dashboard');
});

router.use('/dashboard', require('./dashboard.route.js'));
router.use('/billing', require('./billing.route.js'));
router.use('/docs', require('./docs.route.js'));
router.use('/admin', require('./admin.route.js'));

router.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;
