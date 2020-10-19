import bodyParser from 'body-parser';
import express from 'express';

export default app => {

    /* System Health Checks */
    app.route('/status')
        .get((req, res) => res.status(200).end())
        .head((req, res) => res.status(200).end());

    /* Allow the API to receive JSON */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
    app.use(express.static('public'))

    app.set('view engine', 'ejs');

    /* Helps with reverse proxy */
    app.enable('trust proxy');

};
