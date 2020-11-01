import {Router} from 'express';

let router = Router();

router.get('/', (req, res) => {
    return res.redirect('/dashboard');
});


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