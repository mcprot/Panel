let mongoose = require('mongoose');

let ServerSchema = new mongoose.Schema({
    ip_address: String,
    location: String,
    api_key: String,
    last_request: Date
});

let ServerModel = mongoose.model('Server', ServerSchema);

module.exports = ServerModel;
