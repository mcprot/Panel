
export default {
    validateLogin(req, res, next) {
        const requiredKeys = ['email', 'password'];
        if(!req.body) {
            req.session.error = "Keys not provided"
            return res.redirect('back');
        }
        const requestKeys = Object.keys(req.body);
        if(!requiredKeys.every(key => requestKeys.includes(key))){
            req.session.error = "Keys not provided"
            return res.redirect('back');
        }
        next();
    },
    validateRegister(req, res, next) {
        const requiredKeys = ['email', 'password', 'firstname', 'lastname'];
        if(!req.body) {
            req.session.error = "Keys not provided"
            return res.redirect('back');
        }
        const requestKeys = Object.keys(req.body);
        if(!requiredKeys.every(key => requestKeys.includes(key))){
            req.session.error = "Keys not provided"
            return res.redirect('back');
        }
        next();
    }
}
