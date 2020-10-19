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
    if (!server) return next(new Error(`A fatal error occured`));

    if (type == "analytic") {
            body.proxies.forEach(proxy => {
                Proxy.exists({_id: proxy.proxy_id}, (err, result) => {
                    let connectionsServer = "connections." + server._id;
                    Analytic.updateOne({proxy_id: proxy.proxy_id},
                        {
                            [connectionsServer]: proxy.connections
                        }, (err, result) => {
                            if (err) {
                                return res.json({
                                    message: "Bad Request",
                                    status: 400,
                                    data: {}
                                });
                            }
                        });
                });
            });
            return res.json({
                message: "Updated Analytics.",
                status: 200,
                data: {}
            });
    } else if (type == "connection") {
            body.connections.forEach(connection => {
                Connection.create({
                    proxy_id: connection.proxy_id,
                    version: connection.version,
                    forge: connection.forge,
                    ip_address: connection.ip_address,
                    date_connect: connection.date_connect,
                    date_disconnect: connection.date_disconnect,
                    success: connection.success,
                    bytes_ingress: connection.bytes_ingress,
                    bytes_egress: connection.bytes_egress,
                    server_id: server._id
                }, (err, result) => {
                    if (err) {
                        return res.json({message: "Bad Request", status: 400, data: {}});
                    }
                });
            });
            return res.json({
                message: "Created Connection Logs",
                status: 200,
                data: {}
            });
    } else {
        return res.json({message: "Bad Request", status: 400, data: {}});
    }


});


router.all('/', (req, res) => {
    return res.json({message: "Unauthorized", status: 401, data: {}});
});

export default router;
