import Server from '../models/server'
import Analytic from '../models/analytic'
import Proxy from '../models/proxy.model'
import Plan from '../models/plan.model'
import Connection from '../models/connection.model'

export default {

    async getProxies() {
        Proxy.find({}, (error, proxies) => {
            if (!error) return proxies;
        });
    },
    async getAnalytics() {
        Analytic.find({}, (error, analytics) => {
            if (!error) return analytics;
        });
    },
    async getPlans() {
        Plan.find({}, (error, plans) => {
            if (!error) return plans;
        });
    },
    async getServers() {
        Server.find({}, (error, servers) => {
            if (!error) return servers;
        });
    },
    async getServer(key) {
        const query = {api_key: key};
        Server.find(query, (error, server) => {
            if (!error) return server;
        });
    },
    async updateProxyAnalytics(serverId, proxy) {
        Proxy.findById({_id: proxy.proxy_id}, (err, doc) => {
            if (err || !doc) return;
            const update = {[`connections.${serverId}`]: proxy.connections}
            Analytic.updateOne({proxy_id: proxy.proxy_id}, update, (err, analytic) => {
                if (err || !analytic) return;
                return true;
            });
        });
    },
    async updateConnectionAnalytics(serverId, connection) {
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
        })
            .then(connection => {
                if (!connection) return;
                return true;
            })
            .catch(error => {
                if (error) return false;
            })
    },
    async updateLastRequest(key) {
        const query = {api_key: key};
        const document = {last_request: Date.now()};
        Server.updateOne(query, document, (err, doc) => {
            return err ? false : doc;
        });
    }


}
