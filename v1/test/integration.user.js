process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();

var expect = chai.expect;

chai.use(chaiHttp);
//Our parent block
describe('TESTING /api/v1/users/*', () => {

  // for use in test
  let tokenUserTest
  let tokenSuperAdmin
  let tokenModeratorTest
  let idUserTest
  let idBanTestUser
  let idSilenceTestUser

  before(function (done) {
    console.log('waiting for Mongoose connection')
    server.on("MongooseReady", function () {
      console.log('Mongoose is ready, starting Tests')
      done();
    });
  });
  beforeEach((done) => { //Before each test we empty the database  
    done()
  });
  describe('/GET /api/v1/ as guest', function () {

    it('it should GET server alive checker', async function () {
      res = await chai.request(server).get('/api/v1/')
      expectSuccess(res)
      expect(res.body.data.result).include.all.keys('message', 'user', 'version', 'commit')
      //console.log(res.body)
    });

    it('it should has error if there is junk body or params', async function () {
      res = await chai.request(server).get('/api/v1/')
        .send({ junk: '123' })
      expectErrors(res)

      res = await chai.request(server).get('/api/v1/users/?asd=1')
        .send({ junk: '123' })
      expectErrors(res)
    });
  });

  describe('/GET /api/v1/users/ as guest', function () {

    it('it should GET all users', async function () {
      res = await chai.request(server).get('/api/v1/users')
      expectSuccess(res)
      expect(res.body.data.result).to.be.a('array');
    });

    it('it should has error if there is junk body or params', async function () {
      res = await chai.request(server).get('/api/v1/users')
        .send({ junk: '123' })
      expectErrors(res)

      res = await chai.request(server).get('/api/v1/users/?asd=1')
        .send({ junk: '123' })
      expectErrors(res)
    });
  });

  describe('/POST /api/v1/users/ as guest', function () {

    it('it should not create users if junk passed in body/params', async function () {
      res = await chai.request(server).post('/api/v1/users/?asd=1')
        .send({ junk: '123' })
      expectErrors(res)
    });

    it('it should Create user', async function () {
      res = await chai.request(server).post('/api/v1/users')
        .send({ username: 'userTest', password: 'userTest' })
      expectSuccess(res, 201)
      expectAnUser(res)
      expect(res.body.data.result.username).to.eql('usertest')
      res = await chai.request(server).post('/api/v1/users')
        .send({ username: 'moderatorTest', password: 'moderatorTest' })
      expectSuccess(res, 201)
      expectAnUser(res)
      expect(res.body.data.result.username).to.eql('moderatortest')
    });

    it('it should not Create same user', async function () {
      res = await chai.request(server).post('/api/v1/users')
        .send({ username: 'userTest', password: 'userTest' })
      expectErrors(res)
    });

  });

  describe('/POST /api/v1/users/login as guest', function () {

    it('it should not login with junk', async function () {
      res = await chai.request(server).post('/api/v1/users/login/?asd=1')
        .send({ junk: '123' })
      expectErrors(res)

    });

    it('it should not login with correct body plus junk', async function () {
      res = await chai.request(server).post('/api/v1/users/login/')
        .send({ username: 'userTest', password: 'userTest', junk: '123' })
      expectErrors(res)

    });

    it('it should not login with incorrect password/username', async function () {
      res = await chai.request(server).post('/api/v1/users/login/')
        .send({ username: 'userTest', password: 'badpassword' })
      expectErrors(res)

      res = await chai.request(server).post('/api/v1/users/login/')
        .send({ username: 'badUser', password: 'userTest' })
      expectErrors(res)

    });

    it('it should login with correct body', async function () {
      res = await chai.request(server).post('/api/v1/users/login/')
        .send({ username: 'userTest', password: 'userTest' })
      expectSuccess(res)
      expect(res.body.data.result).to.have.all.keys('token', 'message', 'links', 'id');

    });

  });
  describe('GET Tokens', function () {
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

  describe('/GET /api/v1/users/:id', function () {

    it('it should GET a user by username/id and /me if logged', async function () {

      // by ID
      res = await chai.request(server).get(`/api/v1/users/${idUserTest}/`)
      expectSuccess(res)
      expectAnUser(res)
      expect(res.body.data.result.id).to.be.eql(idUserTest)

      // by Username
      res = await chai.request(server).get(`/api/v1/users/usertest/`)
      expectSuccess(res)
      expectAnUser(res)
      expect(res.body.data.result.id).to.be.eql(idUserTest)

      // by me/username/id if logged
      res = await chai.request(server).get(`/api/v1/users/${idUserTest}/`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
      expectAnUser(res)
      expect(res.body.data.result.id).to.be.eql(idUserTest)

      res = await chai.request(server).get(`/api/v1/users/me/`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
      expectAnUser(res)
      expect(res.body.data.result.id).to.be.eql(idUserTest)

      res = await chai.request(server).get(`/api/v1/users/usertest/`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
      expectAnUser(res)
      expect(res.body.data.result.id).to.be.eql(idUserTest)
    });
    it('it should not Get an inexistent user', async function () {
      res = await chai.request(server).get(`/api/v1/users/notanuser/`)
      expectErrors(res)
    });

  });

  // TODO roles

  describe('/GET /api/v1/users/:id/roles NOT IMPLEMENTED', function () {

    it('it should GET moderatorTest roles', async function () {
      res = await chai.request(server).get(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
    });
  });

  describe('/POST /api/v1/users/:id/roles', function () {

    it('it shouldnt add roles without admin or bad role info', async function () {
      res = await chai.request(server).post(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenUserTest)
      expectErrors(res)
      res = await chai.request(server).post(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
      expectErrors(res)
      res = await chai.request(server).post(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'admon' })
      expectErrors(res)
      res = await chai.request(server).post(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'superadmin' })
      expectErrors(res)
    });

    it('it should add MODERATOR and ADMIN roles to moderatorTest', async function () {
      res = await chai.request(server).post(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'moderator' })
      expectSuccess(res)
      res = await chai.request(server).post(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'admin' })
      expectSuccess(res)
    });
  });
  describe('/DELETE /api/v1/users/:id/roles', function () {

    it('it shouldnt delete roles without admin or bad role info', async function () {
      res = await chai.request(server).delete(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenUserTest)
      expectErrors(res)
      res = await chai.request(server).delete(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
      expectErrors(res)
      res = await chai.request(server).delete(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'admon' })
      expectErrors(res)
      res = await chai.request(server).delete(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'superadmin' })
      expectErrors(res)
    });

    it('it should delete ADMIN role to moderatorTest', async function () {

      res = await chai.request(server).delete(`/api/v1/users/moderatortest/roles`)
        .set('Authorization', tokenSuperAdmin)
        .send({ role: 'admin' })
      expectSuccess(res)
    });
  });

  describe('/POST /api/v1/users/:id/bans/', function () {

    it('it should not create a Ban with junk or not admin', async function () {
      // not admin
      res = await chai.request(server).post(`/api/v1/users/usertest/bans/`)
        .set('Authorization', tokenUserTest)
        .send({ username: 'userTest', password: 'userTest' })
      expectErrors(res)
      // not body
      res = await chai.request(server).post(`/api/v1/users/usertest/bans/`)
        .set('Authorization', tokenSuperAdmin)
      expectErrors(res)
      // bad body
      res = await chai.request(server).post(`/api/v1/users/usertest/bans/`)
        .set('Authorization', tokenSuperAdmin)
        .send({ reason: 123, timePenalty: 'badtime eh' })
      expectErrors(res)
    });

    it('it should Ban userTest', async function () {
      res = await chai.request(server).post(`/api/v1/users/usertest/bans/`)
        .set('Authorization', tokenSuperAdmin)
        .send({ reason: 'testing ban', timePenalty: 60000 })
      expectSuccess(res)
    });

    it('it shouldnt be possible login for userTest or use token', async function () {
      res = await chai.request(server).get(`/api/v1/users/me`)
        .set('Authorization', tokenUserTest)
      expectErrors(res)

      res = await chai.request(server).post('/api/v1/users/login/')
        .send({ username: 'userTest', password: 'userTest' })
      expectErrors(res)
    });
  });

  describe('/GET /api/v1/users/:id/bans/', function () {

    it('it should get the ban of userTest', async function () {
      res = await chai.request(server).get(`/api/v1/users/usertest/bans/`)
        .set('Authorization', tokenSuperAdmin)
      expectSuccess(res)
      expect(res.body.data.result).to.be.a('array');
      expect(res.body.data.result[0]).to.include.all.keys('reason', 'id', 'kind');
      expect(res.body.data.result[0].kind).to.be.eql('ban')
      idBanTestUser = res.body.data.result[0].id
    });
  });

  describe('/DELETE /api/v1/users/:id/bans/:banId', function () {

    it('it should DELETE the ban of userTest', async function () {
      res = await chai.request(server).delete(`/api/v1/users/usertest/bans/${idBanTestUser}`)
        .set('Authorization', tokenSuperAdmin)
      expectSuccess(res)
    });
    it('it should be possible again login for userTest or use token', async function () {
      res = await chai.request(server).get(`/api/v1/users/me`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
      res = await chai.request(server).post('/api/v1/users/login/')
        .send({ username: 'userTest', password: 'userTest' })
      expectSuccess(res)
    });
  });

  // TODO add moderator
  describe('/POST /api/v1/users/:id/silences/', function () {

    it('it should not create a Silence with junk or not moderator at least', async function () {
      // not admin
      res = await chai.request(server).post(`/api/v1/users/usertest/silences/`)
        .set('Authorization', tokenUserTest)
        .send({ username: 'userTest', password: 'userTest' })
      expectErrors(res)
      // not body
      res = await chai.request(server).post(`/api/v1/users/usertest/silences/`)
        .set('Authorization', tokenSuperAdmin)
      expectErrors(res)
      // bad body
      res = await chai.request(server).post(`/api/v1/users/usertest/silences/`)
        .set('Authorization', tokenSuperAdmin)
        .send({ reason: 123, timePenalty: 'badtime eh' })
      expectErrors(res)
    });
    it('it should Silence userTest using moderator user', async function () {
      res = await chai.request(server).post(`/api/v1/users/usertest/silences/`)
        .set('Authorization', tokenModeratorTest)
        .send({ reason: 'testing silence', timePenalty: 60000 })
      expectSuccess(res)
    });
    it('it should testUser have silenced property', async function () {
      res = await chai.request(server).get(`/api/v1/users/usertest`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
      expect(new Date(res.body.data.result.silenced)).to.be.a('date')

    });
  });

  describe('/GET /api/v1/users/:id/silences/', function () {

    it('it should get the silence of userTest', async function () {
      res = await chai.request(server).get(`/api/v1/users/usertest/silences/`)
        .set('Authorization', tokenSuperAdmin)
      expectSuccess(res)
      expect(res.body.data.result).to.be.a('array');
      expect(res.body.data.result[0]).to.include.all.keys('reason', 'id', 'kind');
      expect(res.body.data.result[0].kind).to.be.eql('silence')
      idSilenceTestUser = res.body.data.result[0].id
    });
  });

  describe('/DELETE /api/v1/users/:id/silences/:silenceId', function () {

    it('it should DELETE the silence of userTest', async function () {
      res = await chai.request(server).delete(`/api/v1/users/usertest/silences/${idSilenceTestUser}`)
        .set('Authorization', tokenModeratorTest)
      expectSuccess(res)
    });
    it('it shouldnt testUser have silenced property', async function () {
      res = await chai.request(server).get(`/api/v1/users/usertest`)
        .set('Authorization', tokenUserTest)
      expectSuccess(res)
      expect(res.body.data.result).to.not.have.property('silenced')
    });
  });

});

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

/*
describe('/GET /api/v1/users/', function () {

  it('it should GET all users', async function () {

  });
});
*/
/*
chai.request(server)
            .get('/api/v1/users')
            .end((err, res) => {
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
            */