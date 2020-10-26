import {Router} from 'express';
let router = Router();

router.get('/faq', function (req, res, next) {
    return res.render("docs_faq", {title: 'Docs | FAQ'});
});

export default router;
