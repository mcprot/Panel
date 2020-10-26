import expressLoader from './express.js';
import mongooseLoader from './mongoose.js';
import sessionLoader from './session.js';
import routeLoader from './router.js';

export default async app => {
    const db = mongooseLoader();
    await expressLoader(app);
    await sessionLoader(app, db);
    await routeLoader(app);
}
