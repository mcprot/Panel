import {Router} from 'express';
import api from './api';
import login from './login.route';

let router = Router();


router.use('/api', api);
router.use('/login', login);
router.use('/register', require('./register.route'));

router.use((req, res, next) => {
    if(req.user != null){
        next();
    }else{
        res.redirect('/login');
    }
});

router.get('/', function (req, res, next) {
    res.redirect('/dashboard');
});

router.use('/dashboard', require('./dashboard.route'));
router.use('/billing', require('./billing.route'));
router.use('/docs', require('./docs.route'));
router.use('/admin', require('./admin.route'));
router.use('/proxy', require('./proxy.route'));

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

export default router;
