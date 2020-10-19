import session from 'express-session';
import connectMongo from 'connect-mongo';
import config from '../config';

const MongoStore = connectMongo(session);

export default (app, db) => {
    app.use(session({
        secret: config.SECRET,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: db
        })
    }));
}
