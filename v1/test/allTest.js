process.env.NODE_ENV = 'test';
const server = require('../../server');
userTest = require('./integration.user')
threadTest = require('./integration.thread')
var mongoose = require('mongoose');
var chalk = require('chalk');
var startTime
var endTime 

before(function (done) {
  console.log(`${chalk.bold.cyan('[TESTING]')} Waiting for Mongoose connection`)
  server.on("MongooseReady", function () {
    console.log(`${chalk.bold.cyan('[TESTING]')} Mongoose is ready, starting tests`)
    done();
  });
});
describe(`${chalk.bold.cyan('[COMPLETE TEST SUITE]')}`, async () => {
  startTime = new Date();
  await userTest.execute(server)
  await threadTest.execute(server)
  
})

after(function() {
  endTime = new Date();
  var timeDiff = endTime - startTime - 20
  console.log(`${chalk.bold.cyan('[TESTING]')} Drop Test Database`)
  mongoose.connection.dropDatabase();
  console.log(`${chalk.bold.cyan('[TESTING]')} Time Elapsed ${chalk.bold.green(timeDiff+' ms')}`)

});
