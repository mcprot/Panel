import {Router} from 'express';
import {apiValidator} from "../validators";
import {apiService} from "../services";

let router = Router();

router.get('/:key/:type', apiValidator.keyIsValid, async (req, res, next) => {

    const type = req.params.type, key = req.params.key;
    await apiService.updateLastRequest(key);

    let payload;
    switch (type) {
        case 'proxies':
            let proxies = await apiService.getProxies()
            if (proxies) payload = proxies;
            break;
        case 'analytics':
            let analytics = await apiService.getAnalytics()
            if (analytics) payload = analytics;
            break;
        case 'plans':
            let plans = await apiService.getPlans()
            if (plans) payload = plans;
            break;
        case 'servers':
            let servers = await apiService.getServers()
            if (servers) payload = servers;
            break;
        default:
            return next(new Error(`Type '${type}' not recognized.`));
    }

    if (payload) {
        return res.json({message: "Fetched", status: 200, data: payload});
    } else {
        return next(new Error('Request failed. Try again later.'));
    }

});

router.put('/:key/:type', apiValidator.keyIsValid, apiValidator.validatePut, async (req, res, next) => {

    const type = req.params.type, key = req.params.key, body = req.body;
    await apiService.updateLastRequest(key);

    const server = await apiService.getServer(key);
    if (!server) return next(new Error(`A fatal error occurred`));

    switch (type) {
        case 'analytic':
            let proxyResults = body.proxies.map(proxy =>
                apiService.updateProxyAnalytics(server._id, proxy));
            if (!proxyResults.every(a => a)) return next(new Error(`Partial update failure.`));
            break;
        case 'connection':
            let connectionResults = body.connections.map(connection =>
                apiService.updateConnectionAnalytics(server._id, connection));
            if (!connectionResults.every(a => a)) return next(new Error(`Partial update failure.`));
            break;
        default:
            return next(new Error(`Type '${type}' not recognized.`));
    }

    return res.json({message: "Updated Analytics.", status: 200, data: {}});
});


router.all('/', (req, res) => {
    return res.json({message: "Unauthorized", status: 401, data: {}});
});

export default router;
