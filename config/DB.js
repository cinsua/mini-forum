//require mongoose module
var mongoose = require('mongoose');
var server = require('../tools/serverTools')

const CONFIG = require('./config')

//const options = { user: 'cinsua', pass: encodeURIComponent('Asus1201n'), keepAlive: true, keepAliveInitialDelay: 300000, useNewUrlParser: true }
//const uriDB = 'mongodb://ds119164.mlab.com:19164/mdbcinsua'
//const uriDB = 'mongodb+srv://cinsua:Asus1201n@cinsua-9r45r.mongodb.net/test?retryWrites=true'

const options = CONFIG.MONGO_OPTIONS
const uriDB = `${CONFIG.MONGO_CONN_URL}/${CONFIG.MONGO_DB_NAME}`
//const dbConn = mongoose.connect(uriDB, options);

//export this function and imported by app.js
module.exports = {
  connectDB: function() {
    mongoose.Promise = global.Promise
    mongoose.connect(uriDB, options);
    mongoose.connection.on('connected', function(){
      console.log(`${server.tagCyan} Succefully connected to ${uriDB}`); // as ${options.user}
    });

    mongoose.connection.on('error', function(err){
      console.log(`${server.tagRed} Cannot connect to DB, reason: ${err}`);
    });

    mongoose.connection.on('disconnected', function(){
      console.log(`${server.tagRed} Disconnected from DB`);
    });

    process.on('SIGINT', () => {
      if(CONFIG.DROP_DATABASE_AT_EXIT){
        console.log(`${server.tagMagenta} Deleting DB`);
        mongoose.connection.dropDatabase();
      }
      console.log(`${server.tagRed} Closing DB connection`);
      mongoose.connection.close()
      console.log(`${server.tagRed} Exiting`);
      process.exit(0);
    })
  
  }
}
      
/*
      function(){
        mongoose.connection.dropDatabase()
        mongoose.connection.close(function(){
          //mongoose.connect(uriDB, options);
          console.log(`${server.tagMagenta} delete db`);

          //mongoose.connection.close()
          console.log(`${server.tagMagenta} Disconnected from DB for aplication termination`);
            process.exit(0)
        });
    });
  }
}
*/