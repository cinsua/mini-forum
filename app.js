require('dotenv').config(); // Sets up dotenv as soon as our application starts
var express = require('express')
require('express-async-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
const db = require('./DB')

var app = express();
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];

var server = require('./tools/serverTools')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

//Passport
app.use(passport.initialize());

// CORS
app.use(cors());

//inicialize DB:
db.connectDB();

//Routes
const routes = require('./routes/index.js');

app.use('/api/v1/', routes(router));


app.listen(`${stage.port}`, () => {
  console.log(`${server.tagGreen} Started at ${Date()}\n${server.tagCyan} Listening on Port${stage.port}`);
});

//npm run dev