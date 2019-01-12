const mongoose = require('mongoose')
const server = require('../tools/serverTools')
const User = require('../v1/models/user')

const CONFIG = require('./config')

//TODO. more pool thread connections (one per service maybe?)
// this should improve the spikes in ms taken by some saves

const options = CONFIG.MONGO.OPTIONS
const uriDB = `${CONFIG.MONGO.CONN_URL}:${CONFIG.MONGO.CONN_PORT}/${CONFIG.MONGO.DB_NAME}`

async function dropDB(){
  if (CONFIG.MONGO.DROP_DATABASE_AT_START) {
    console.log(`${server.tagMagenta} Deleting DB`)
    mongoose.connection.dropDatabase()
  }
}

async function createAdmin() {
  //console.log(`${server.tagMagenta} Filling DB`)
  let superadmin = await User.findOne({ username: 'superadmin' })
  if (!superadmin) {
    superadmin = new User
    superadmin.username = 'superadmin'
    superadmin.password = CONFIG.MONGO.SUPERADMIN_PASS
    superadmin.roles = ['moderator', 'admin', 'superadmin']
    superadmin.save()
    console.log(`${server.tagMagenta} Superadmin created`)
  }
  let user1 = await User.findOne({ username: 'user1' })
  if (!user1) {
    user1 = new User({ username: 'user1', password: 'user1', roles: ['user'] })
    user1.save()
    console.log(`${server.tagMagenta} User1 created`)
    //console.log('user1 created')
  }

}

//export this function and imported by app.js
module.exports = {

  async connectDB (app) {
    mongoose.Promise = global.Promise
    mongoose.connect(uriDB, options)
    mongoose.connection.on('connected', async function () {
      console.log(`${server.tagCyan} Succefully connected to ${uriDB}`)
      await dropDB()
      await createAdmin()
      app.emit('MongooseReady')
    })

    mongoose.connection.on('error', function (err) {
      console.log(`${server.tagRed} Cannot connect to DB, reason: ${err}`)
      // TODO reconnect mechanism
    })

    mongoose.connection.on('disconnected', function () {
      console.log(`${server.tagRed} Disconnected from DB`)
    })

    process.on('SIGINT', () => {
      if (CONFIG.MONGO.DROP_DATABASE_AT_EXIT) {
        console.log(`${server.tagMagenta} Deleting DB`)
        mongoose.connection.dropDatabase()
      }
      console.log(`${server.tagRed} Closing DB connection`)
      mongoose.connection.close()
      console.log(`${server.tagRed} Exiting`)
      process.exit(0)
    })

  }

}