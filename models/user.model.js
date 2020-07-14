let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    firstname: String,
    lastname: String,
    password: String,
    date: {type: Date, default: Date.now}
});

UserSchema.statics.authenticate = (email, password) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({"email": {$regex: new RegExp(email, "i")}}).exec().then(user => {
            if (!user) {
                let err = new Error('An account could not be found using that email/password.');
                err.status = 401;
                reject(err);
            }
            verifyHash(password, user.password).then(() => {
                resolve(user);
            }).catch(() => {
                let err = new Error("An account could not be found using that email/password.");
                reject(err);
            });
        });
    });
};

UserSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified('password')) return next();
    user.password = await hashPassword(user.password);
    next();
});

let hashPassword = (password) => new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(new Error(err));
        resolve(hash);
    });
});

let verifyHash = (password, original) => new Promise((resolve, reject) => {
    bcrypt.compare(password, original, function (err, result) {
        if (err) reject(new Error(err));
        resolve(result);
    });
});

let UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
