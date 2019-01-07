let chai = require('chai');
let chaiHttp = require('chai-http');
//let server = require('../../server');

var expect = chai.expect;

var server

function execute(serv) {
  server = serv
  chai.use(chaiHttp);
  /*
  before(function (done) {
    console.log('waiting for Mongoose connection')
    server.on("MongooseReady", function () {
      console.log('Mongoose is ready, starting Tests')
      done();
    });
    
  });*/
  describe('TESTING /api/v1/threads/*', async () => {
    describe('/GET /api/v1/ as guest', function () {

      it('it should GET server alive checker', async function () {
        res = await chai.request(server).get('/api/v1/')
        expectSuccess(res)
        expect(res.body.data.result).include.all.keys('message', 'user', 'version', 'commit')
        //console.log(res.body)
      });

    })
  })


}
module.exports.execute = execute

function expectAnUser(res) {
  expect(res.body.data.result).to.include.all.keys('username', 'id', 'links');
}

function expectSuccess(res, status = 200) {
  expect(res).to.have.status(status);
  expect(res.body).to.have.all.keys('success', 'data');
  expect(res.body).to.have.property('success').eql(true);
  expect(res.body.data).to.have.property('result')
}

function expectErrors(res) {
  expect(res).to.have.status(500);
  expect(res.body).to.have.all.keys('success', 'errors');
  expect(res.body.errors).to.be.a('array');
  expect(res.body).to.have.property('success').eql(false);
}