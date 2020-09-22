const config = require("./env/env.js");
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let compression = require('compression');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let favicon = require('serve-favicon');

let User = require('./models/user.model');

app.use(compression());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Connect to MongoDB
mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Set variables in our mongo connection
let db = mongoose.connection;
mongoose.set('useCreateIndex', true);

// Handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// Announce success
db.once('open', function () {
    console.log('Connected to MongoDB with no errors.');
});

//use sessions for tracking logins
app.use(session({
    secret: 'magic',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// Allow higher upload size
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));

// Define EJS as our primary view engine
app.set('view engine', 'ejs');

// serve static files from template
app.use(express.static(__dirname + '/public'));

// Local variables allowed in all ejs classes
app.locals.platform = {};
app.locals.platform.version = require("./package.json").version;
app.locals.platform.hostname = require('os').hostname();
app.locals.platform.instance = (process.env.NODE_ENV === "production") ? process.env.INSTANCE_ID : "fork";

// Managing locals and session variables for use in routes
app.use((req, res, next) => {
    User.findById(req.session.userId).exec().then(user => {
        app.locals.info = req.session.info;
        app.locals.error = req.session.error;
        req.session.info = null;
        req.session.error = null;
        app.locals.url = req.url;
        app.locals.user = user;
        req.user = user;
        next();
    }).catch(err => {
        next(new Error(err));
    });
});

// Load in routes and assign their path with express
const routes = require('./routes/');
app.use('/', routes);

// Manage requests not in routes (Cast to 404)
app.use((req, res, next) => {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// Manage all errors
app.use((err, req, res, next) => {
    console.log(err);
    return res.render("error", {title: "Error"});
});

// Start server and listen on port
app.listen(config.PORT, function () {
    console.log(`mcprot panel started. Listing on port ${config.PORT}.`);
});
