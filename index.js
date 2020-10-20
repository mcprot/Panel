import express from 'express';
import config from './config';
import loaders from './loaders';

async function start() {
    const app = express();

    await loaders(app);

    const port = config.PORT;
    app.listen(port, () => console.log(`Website started, listening on port ${port}.`));
}

export default start();
