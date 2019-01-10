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
    console.log(`${chalk.bold.cyan('┌'+'─'.repeat(78)+'┐')}`)
    done();
  });
});
describe(`  ${chalk.bold.green('[COMPLETE TEST SUITE]')}`, async () => {
  startTime = new Date();
  userTest.execute(server)
  threadTest.execute(server)
  
})

after(async function() {
  endTime = new Date();
  var timeDiff = endTime - startTime - 20
  console.log(`${chalk.bold.green('  [FINISHED IN ')} ${chalk.bold.green(timeDiff+' ms]')}`)
  console.log(chalk.bold.cyan('└'+'─'.repeat(78)+'┘'))
  console.log('')
  console.log(`${chalk.bold.cyan('[TESTING]')} Drop Test Database`)
  await mongoose.connection.dropDatabase();
  

});
