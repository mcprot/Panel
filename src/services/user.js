import User from '../models/user'

export default {
    async createUser(user) {
        const userRecord = await User.create(user);
        if (!userRecord) throw `Failed to register: ${userRecord.errmsg}`;
        return userRecord;
    },
    async authenticateUser(email, password) {
        const userRecord = await User.authenticate(email, password);
        if (!userRecord) throw new Error('Authentication Failed');
        return userRecord;
    }
}
