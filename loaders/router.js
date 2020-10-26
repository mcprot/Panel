import bodyParser from 'body-parser';
import express from 'express';
import routes from '../routes';

export default app => {

    /* Define endpoint prefix */
    app.use((req, res, next) => {
        app.locals.error = req.session.error;
        req.session.error = null;
        next();
    });

    /* Define endpoint prefix */
    app.use('/', routes);

    /* Catch all unhandled requests */
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    /* Handler all errors */
    app.use((err, req, res, next) => {
        return res.json({message: err, status: err.code || 500})
    });

};
