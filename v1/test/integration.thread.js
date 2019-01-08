let chai = require('chai');
let chaiHttp = require('chai-http');
//let server = require('../../server');
var chalk = require('chalk');
var expect = chai.expect;

var server

function execute(serv) {
  server = serv
  chai.use(chaiHttp);

  describe(`\n    ${chalk.bold.green('✱ Routes /api/v1/threads/*')}\n`, function () {
    let tokenUserTest
    let tokenSuperAdmin
    let tokenModeratorTest
    let idUserTest
    let idThread1
    let idPrivated

    describe('Get Tokens for next Tests', function () {
      it('from testUser and superadmin for next tests', async function () {

        //get token for all request as user / superadmin
        res = await chai.request(server).post('/api/v1/users/login/')
          .send({ username: 'userTest', password: 'userTest' })
        idUserTest = res.body.data.result.id
        tokenUserTest = res.body.data.result.token

        res = await chai.request(server).post('/api/v1/users/login/')
          .send({ username: 'superadmin', password: 'superadmin' })
        tokenSuperAdmin = res.body.data.result.token

        res = await chai.request(server).post('/api/v1/users/login/')
          .send({ username: 'moderatortest', password: 'moderatorTest' })
        tokenModeratorTest = res.body.data.result.token
      });
    });

    describe(`[POST]\t/api/v1/threads/`, function () {

      it('it should not create thread if junk passed in body/params or not logged in', async function () {
        res = await chai.request(server).post('/api/v1/users/?asd=1')
          .send({ junk: '123' })
        expectErrors(res)
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'user 1 thread', content: 'testing content' })
        expectErrors(res)
      });

      it('it should Create thread1 and threadPrivate by user1', async function () {
        //thread1
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'thread1', content: 'testing content' })
          .set('Authorization', tokenUserTest)
        expectSuccess(res, 201)
        expect(res.body.data.result).to.include.all.keys('title', 'id', 'content', 'author');
        expect(res.body.data.result.author).to.be.eql(idUserTest)
        expect(res.body.data.result.title).to.be.eql('thread1')
        idThread1 = res.body.data.result.id
        // private
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'threadPrivate', content: 'testing content private', private: true })
          .set('Authorization', tokenUserTest)
        expectSuccess(res, 201)
        expect(res.body.data.result).to.include.all.keys('title', 'id', 'content', 'author');
        expect(res.body.data.result.author).to.be.eql(idUserTest)
        expect(res.body.data.result.title).to.be.eql('threadPrivate')
        idPrivated = res.body.data.result.id
      });

      it('it should not Create thread with same title', async function () {
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'thread1', content: 'testing content22222' })
        expectErrors(res)
      });

    });
    describe(`[GET]\t/api/v1/threads/`, function () {

      it('it should GET all threads as guest or logged in', async function () {
        resGuest = await chai.request(server).get('/api/v1/threads')
        expectSuccess(resGuest)
        expect(resGuest.body.data.result).to.be.a('array');
        resUser = await chai.request(server).get('/api/v1/threads')
          .set('Authorization', tokenUserTest)
        expectSuccess(resUser)
        expect(resUser.body.data.result).to.be.a('array');

        expect(resUser.body.data.result).to.be.eql(resGuest.body.data.result);
      });

      it('it should has error if there is junk body or params', async function () {
        res = await chai.request(server).get('/api/v1/threads')
          .send({ junk: '123' })
        expectErrors(res)
        res = await chai.request(server).get('/api/v1/threads/?asd=1')
          .send({ junk: '123' })
        expectErrors(res)
      });
    });

  });

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