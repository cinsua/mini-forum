var express = require('express')
//var mongoose = require('mongoose')
var app = express();

//All needed for connection with mLab
//Rewrite with async ?

const mongoose = require('mongoose');
var mongodbUri ='mongodb://ds119164.mlab.com:19164/mdbcinsua';
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  auth: {
    user: 'cinsua',
    password: 'Asus1201n'
  }
})
var conn = mongoose.connection;    
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', () =>{
 console.log('connected to adatabase')                       
});

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
  console.log('Example app listening on port 3000!')
})