const dev = require('./env.dev.js');
const prod = require('./env.prod.js');

module.exports = (process.env.NODE_ENV === 'production') ? prod : dev;