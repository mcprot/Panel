import {Router} from 'express';

let router = Router();
let User = require('../models/user');


router.get('/', (req, res, next) => {
    return res.render('login', {title: "Login"});
});

router.post('/', (req, res) => {
    if(req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password).then(user => {
            req.session.userid = user._id;
            console.log("Success")
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
