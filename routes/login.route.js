import {Router} from 'express';

let router = Router();
let User = require('../models/user.model');


router.get('/', (req, res, next) => {
    return res.render('login', {title: "Login"});
});

router.post('/', (req, res) => {
    if(req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password).then(user => {
            req.session.userId = user._id;
            res.redirect('/dashboard');
        }).catch(err => {
            req.session.error = "Incorrect email or password.";
            res.redirect('back');
        });
    }else{
        req.session.error = "You must complete all fields.";
        res.redirect('back');
    }
});

export default router;
