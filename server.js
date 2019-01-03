var express = require('express')
// this module allow capture all errors, sync n async, by middlewares
// its a node patch, sounds bad, but is tradeoff for cleaner code
// eliminate the boilerplate from try/catch and wrappers
// express 5.0 should bring this in vanilla
require('express-async-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const db = require('./config/DB')

//Routes
const userRoutes = require('./v1/routes/user')
const threadRoutes = require('./v1/routes/thread')
const apiV1 = require('./v1/routes/index.js');

var app = express();

// config server variables
const CONFIG = require('./config/config.js');
var server = require('./tools/serverTools')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logger('combined'))

// reference to routes registered
app.routes = userRoutes.routes
app.routes = Object.assign(app.routes, threadRoutes.routes)

//Passport
app.use(passport.initialize());

// CORS
app.use(cors());

//inicialize DB:
db.connectDB();

// Register all routes defined in app.routes
apiV1.setupRoutes(app)

app.listen(`${CONFIG.PORT}`, () => {
  console.log(`${server.tagGreen} ${CONFIG.APP_NAME} started at ${Date().toString().slice(0, 24)}\n${server.tagCyan} Listening on Port${CONFIG.PORT}`);
  console.log(`${server.tagWhite} Version: ${CONFIG.VERSION} Commit:${CONFIG.COMMIT} Environment: ${process.env.NODE_ENV} `)
});

//npm run dev