import {Router} from 'express';

let router = Router();
let User = require('../models/user');

router.get('/', (req, res) => {
    return res.render('register', {title: "Register"});
});

router.post('/', (req, res) => {
    if(req.body.email && req.body.password && req.body.firstname && req.body.lastname){
        let payload = {
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };
       User.create(payload).then(user => {
           req.session.userId = user._id;
           res.redirect('/dashboard');
       }).catch(err => {
           req.session.error = "An account has been found with that email. Please try logging in.";
           res.redirect('back');
       });
    }else{
        req.session.error = "You must complete all fields.";
        res.redirect('back');
    }
});

export default router;
