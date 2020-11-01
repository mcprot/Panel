import Users from '../models/user'

export default {
    async injectUser(req, res, next) {
        if(req.session.userid){
            const userRecord = await Users.findById(req.session.userid);
            if(userRecord) res.locals.user = userRecord;
            return next();
        }else{
            return res.redirect('/login');
        }
    }
}
