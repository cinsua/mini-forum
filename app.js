require('dotenv').config(); // Sets up dotenv as soon as our application starts
var express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');

var app = express();
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];

var db = require('./DB')
db.connectDB()
var server = require('./tools/serverTools')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

//Routes

app.get('/', function (req, res) {
  console.log('we received GET: ',req.query)
  res.send(`Hello , you send ${JSON.stringify(req.query)}`)
})

app.post('/', function (req, res) {
  console.log('we received POST: ', req.query)
  res.send(`Hello World! post ${JSON.stringify(req.query)}`)
})

app.listen(3000, function () {
  console.log('--------------------------------------------------------------------------------')
  console.log(`${server.tagGreen} Started at ${Date()}\n${server.tagCyan} Listening on Port 3000`)
})

//npm run dev