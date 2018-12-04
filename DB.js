
//DEPRECATED

//require mongoose module
var mongoose = require('mongoose');
var server = require('./tools/serverTools')
//require chalk module to give colors to console text
var chalk = require('chalk');

//require database URL from properties file
//var dbURL = require('./property').db;

//const options = { user: 'cinsua', pass: encodeURIComponent('Asus1201n'), keepAlive: true, keepAliveInitialDelay: 300000, useNewUrlParser: true }
//const uriDB = 'mongodb://ds119164.mlab.com:19164/mdbcinsua'
//const uriDB = 'mongodb+srv://cinsua:Asus1201n@cinsua-9r45r.mongodb.net/test?retryWrites=true'
//mongodb://cinsua:<PASSWORD>@cinsua-shard-00-00-9r45r.mongodb.net:27017,cinsua-shard-00-01-9r45r.mongodb.net:27017,cinsua-shard-00-02-9r45r.mongodb.net:27017/test?ssl=true&replicaSet=cinsua-shard-0&authSource=admin&retryWrites=true
const uriDB = 'mongodb://localhost:27017/myapp'

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

//export this function and imported by app.js
module.exports = {
  connectDB: function() {
    mongoose.connect(uriDB) //, options);

    mongoose.connection.on('connected', function(){
      console.log(`${server.tagCyan} Succefully connected to ${uriDB}`); // as ${options.user}
      //console.log(`${server.tagCyan} MongoDB hosted by MLAB`);
    });

    mongoose.connection.on('error', function(err){
      console.log(`${server.tagRed} Cannot connect to DB, reason: ${err}`);
    });

    mongoose.connection.on('disconnected', function(){
      console.log(`${server.tagRed} Disconnected from DB`);
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
          console.log(`${server.tagMagenta} Disconnected from DB for aplication termination`);
            process.exit(0)
        });
    });
  }
}


//with async await.. some events missing
/*
const mongoose = require('mongoose')
const options = { user: 'cinsua', pass: encodeURIComponent('Asus1201n'), keepAlive: true, keepAliveInitialDelay: 300000,
                useNewUrlParser: true }
const uriDB = 'mongodb://ds119164.mlab.com:19164/mdbcinsua'
const dbConn = mongoose.connect(uriDB, options);
(async () => {
  var db = await mongoose.connection;
  console.log(`[Server] Connected to ${uriDB} as ${options.user}\n[Server] MongoDB hosted in MLAB`);
})().catch(e => {
  console.log('Fail', e);
});
*/