import Server from '../models/server'
import Analytic from '../models/analytic'
import Proxy from '../models/proxy.model'
import Plan from '../models/plan.model'
import Connection from '../models/connection.model'

export default {

    async getProxies() {
        Proxy.find({}, (error, proxies) => {
            if(!error) return proxies;
        });
    },
    async getAnalytics() {
        Analytic.find({}, (error, analytics) => {
            if(!error) return analytics;
        });
    },
    async getPlans() {
        Plan.find({}, (error, plans) => {
            if(!error) return plans;
        });
    },
    async getServers() {
        Server.find({}, (error, servers) => {
            if(!error) return servers;
        });
    },
    async getServer(key) {
        const query = {api_key: key};
        Server.find(query, (error, server) => {
            if(!error) return server;
        });
    },
    async updateLastRequest(key) {
        const query = {api_key: key};
        const document = {last_request: Date.now()};
        Server.updateOne(query, document, (err, doc) => {
            return err ? false : doc;
        });
    }


}
