let express = require('express');
let router = express.Router();

let Server = require("../models/server.model");
let Analytic = require("../models/analytic.model");
let Proxy = require("../models/proxy.model")
let Plans = require("../models/plan.model")
let Connection = require("../models/connection.model")

router.get('/:api_key/:type', function (req, res, next) {
    if (req.params.api_key && req.params.type) {
        Server.exists({api_key: req.params.api_key}, (err, result) => {
            if (result) {
                let type = req.params.type;

                Server.updateOne({api_key: req.params.api_key}, {last_request: Date.now()}, (err, result) => {
                });

                /*
                types
                - proxies
                - analytics
                - plans
                - server (get the info about the server using it's api key)
                 */

                if (type == "proxies") {
                    Proxy.find({}, (err, result) => {
                        return res.json({message: "Fetched Proxies", status: 200, data: result});
                    });
                } else if (type == "analytics") {
                    Analytic.find({}, (err, result) => {
                        return res.json({message: "Fetched Analytics", status: 200, data: result});
                    });
                } else if (type == "plans") {
                    Plans.find({}, (err, result) => {
                        return res.json({message: "Fetched Plans", status: 200, data: result});
                    });
                } else if (type == "server") {
                    Server.findOne({api_key: req.params.api_key}, (err, result) => {
                        return res.json({message: "Success", status: 200, data: result});
                    });
                } else {
                    return res.json({message: "Bad Request", status: 400, data: {}});
                }
            } else {
                return res.json({message: "Unauthorized", status: 401, data: {}});
            }
        });
    } else {
        return res.json({message: "Bad Request", status: 400, data: {}});
    }
});

router.put('/:api_key/:type', (req, res, next) => {
    let body = req.body;
    if (req.params.api_key && req.params.type) {
        Server.exists({api_key: req.params.api_key}, (err, result) => {
            if (result) {
                let type = req.params.type;

                Server.updateOne({api_key: req.params.api_key}, {last_request: Date.now()}, (err, result) => {
                });

                /*
                types
                - connection
                - analytic
                 */

                Server.findOne({api_key: req.params.api_key}, (err, server) => {
                    if (server) {
                        if (type == "analytic") {
                            let analyticKeys = ['proxy_id', 'connections', 'bandwidth'];
                            if (analyticKeys.every(item => body.proxies[0].hasOwnProperty(item))) {
                                body.proxies.forEach(proxy => {
                                    Proxy.exists({_id: proxy.proxy_id}, (err, result) => {
                                        let connectionsServer = "connections." + server._id;
                                        Analytic.updateOne({proxy_id: proxy.proxy_id},
                                            {
                                                [connectionsServer]: proxy.connections,
                                                $inc: {bandwidth: proxy.bandwidth}
                                            }, (err, result) => {
                                                if (result) {
                                                    return res.json({
                                                        message: "Updated Analytics.",
                                                        status: 200,
                                                        data: {}
                                                    });
                                                }
                                            });
                                    });
                                });
                            } else {
                                return res.json({message: "Bad Request", status: 400, data: {}});
                            }
                        } else if (type == "connection") {
                            let connectionKeys = ['proxy_id', 'version', 'forge', 'ip_address', 'date', 'success']
                            if (connectionKeys.every(item => body.connections[0].hasOwnProperty(item))) {
                                body.connections.forEach(connection => {
                                    Connection.create({
                                        proxy_id: connection.proxy_id,
                                        version: connection.version,
                                        forge: connection.forge,
                                        ip_address: connection.ip_address,
                                        date: connection.date,
                                        success: connection.success,
                                        server_id: server._id
                                    }, (err, result) => {
                                        if(result) {
                                            return res.json({
                                                message: "Created Connection Logs",
                                                status: 200,
                                                data: {}
                                            });
                                        }
                                    });
                                });
                            } else {
                                return res.json({message: "Bad Request", status: 400, data: {}});
                            }
                        } else {
                            return res.json({message: "Bad Request", status: 400, data: {}});
                        }
                    } else {
                        return res.json({message: "Unauthorized", status: 401, data: {}});
                    }
                });
            } else {
                return res.json({message: "Bad Request", status: 400, data: {}});
            }
        });
    } else {
        return res.json({message: "Bad Request", status: 400, data: {}});
    }
});


router.get('/', function (req, res, next) {
    return res.json({message: "Unauthorized", status: 401, data: {}});
});

router.post('/', function (req, res, next) {
    return res.json({message: "Unauthorized", status: 401, data: {}});
});

module.exports = router;