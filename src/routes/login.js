import {Router} from 'express';
import {userService} from '../services';
import {authValidator} from '../validators';

let router = Router();

router.get('/', (req, res, next) => {
    return res.render('login', {title: "Login"});
});

router.post('/',
    authValidator.validateLogin,
    async (req, res) => {
        try {
            const user = await userService.authenticateUser(req.body.email, req.body.password);
            if (user) {
                req.session.userid = user._id;
                return res.redirect('/');
            } else {
                req.session.error = "Invalid Credentials";
                return res.redirect('back');
            }
        } catch (e) {
            req.session.error = "Invalid Credentials";
            return res.redirect('back');
        }
    });

export default router;
