require('dotenv').config(); // Sets up dotenv as soon as our application starts
var express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');

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

//Routes
const routes = require('./routes/index.js');

app.use('/api/', routes(router));

app.listen(`${stage.port}`, () => {
  console.log(`${server.tagGreen} Started at ${Date()}\n${server.tagCyan} Listening on Port${stage.port}`);
});

//npm run dev