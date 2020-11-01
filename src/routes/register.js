import {Router} from 'express';
import {authValidator} from '../validators';
import {userService} from "../services";

let router = Router();
let User = require('../models/user');

router.get('/',
    (req, res) => {
        return res.render('register', {title: "Register"});
    });

router.post('/',
    authValidator.validateRegister,
    async (req, res) => {
        try {
            const userRecord = await userService.createUser(req.body);
            if (userRecord) {
                req.session.userid = user._id;
                res.redirect('/dashboard');
            }
        } catch (e) {
            console.log(e);
            req.session.error = e.errmsg;
            res.redirect('back');
        }
    }
);

export default router;
