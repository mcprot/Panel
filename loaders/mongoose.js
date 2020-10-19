import mongoose from 'mongoose';
import config from '../config';

export default () => {
    /* MongoDB Connection */
    mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});
    mongoose.set('useCreateIndex', true);

    /* Mongoose Logging */
    let db = mongoose.connection;
    db.on('error', (error) => console.log(`Connection Failed: ${error}`));
    db.once('open', () => console.log('Connected to MongoDB with no errors.'));
    return db;
};
