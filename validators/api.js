import Server from '../models/server'

export default {
    keyIsValid(req, res, next) {

        if (!req.params.key || !req.params.type) {
            let err = new Error('Invalid request. Missing required params.');
            err.code = 400;
            return next(err)
        }

        let err = new Error('Invalid request. Server does not exist.');
        err.code = 400;

        const query = {api_key: req.params.key};
        Server.exists(query)
            .then(result => {
                if (!result) return next(new Error('API_Key invalid.'))
            })
            .catch(error => {
                if (error) return next(err)
            });

        next();
    },
    validatePut(req, res, next) {
        const requiredKeys = {
            analytic:
                ['proxy_id', 'connections'],
            connection:
                ['proxy_id', 'version', 'forge', 'ip_address', 'bytes_ingress',
                    'bytes_egress', 'date_connect', 'date_disconnect', 'success']
        };

        const requestBody = !!req.body ? req.body : {}, requestKeys = Object.keys(requestBody), type = req.params.type;

        if(!Object.keys(requiredKeys).includes(type)) return next(new Error(`Type '${type}' unknown.`))

        /* Ensure the request body contains required object keys */
        if (!requiredKeys[type].every(key => requestKeys.includes(key))
            || requestKeys.length > requiredKeys.length)
            return next(new Error('Invalid request.'))

        next();
    }
}
