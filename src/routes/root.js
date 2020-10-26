import {Router} from 'express';

let router = Router();

router.get('/', (req, res) => {
    return res.redirect('/dashboard');
});

export default router;
