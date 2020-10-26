import Server from '../models/server'
import Analytic from '../models/analytic'
import Proxy from '../models/proxy'
import Plan from '../models/plan'
import Connection from '../models/connection'

export default {

    async getProxies() {
        return await Proxy.find({})
            .then(proxies => proxies)
            .catch(() => undefined)
    },
    async getAnalytics() {
        return await Analytic.find({})
            .then(analytics => analytics)
            .catch(() => undefined)
    },
    async getPlans() {
        return await Plan.find({})
            .then(plans => plans)
            .catch(() => undefined)
    },
    async getServers() {
        return await Server.find({})
            .then(servers => servers)
            .catch(() => undefined)
    },
    async getServer(key) {
        const query = {api_key: key};
        return await Server.find(query)
            .then(server => server)
            .catch(() => undefined)
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
