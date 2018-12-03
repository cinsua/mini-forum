var express = require('express')
//var mongoose = require('mongoose')
var db = require('./DB')
var server = require('./tools/serverTools')
//import db from './DB'
var app = express();
var globalTunnel = require('global-tunnel');
 
globalTunnel.initialize({
  host: '10.210.198.12',
  port: 8080,
  sockets: 50 // optional pool size for each http and https
});
db.connectDB()


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
  console.log(`${server.tagGreen} Started at ${Date()}\n${server.tagCyan} Listening on Port 3000`)
})