let chai = require('chai')
let chaiHttp = require('chai-http')
//let server = require('../../server')
const chalk = require('chalk')
const expect = chai.expect

function expectSuccess(res, status = 200) {
  expect(res).to.have.status(status)
  expect(res.body).to.have.all.keys('success', 'data')
  expect(res.body).to.have.property('success').eql(true)
  expect(res.body.data).to.have.property('result')
}

function expectErrors(res) {
  expect(res).to.have.status(500)
  expect(res.body).to.have.all.keys('success', 'errors')
  expect(res.body.errors).to.be.a('array')
  expect(res.body).to.have.property('success').eql(false)
}

let server
function execute(serv) {
  server = serv
  chai.use(chaiHttp)

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
      })
    })

    describe(`[POST]\t/api/v1/threads/`, function () {

      it('it should not create thread if junk passed in body/params or not logged in', async function () {
        res = await chai.request(server).post('/api/v1/users/?asd=1')
          .send({ junk: '123' })
        expectErrors(res)
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'user 1 thread', content: 'testing content' })
        expectErrors(res)
      })

      it('it should Create thread1 and threadPrivate by user1', async function () {
        //thread1
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'thread1', content: 'testing content' })
          .set('Authorization', tokenUserTest)
        expectSuccess(res, 201)
        expect(res.body.data.result).to.include.all.keys('title', 'id', 'content', 'author')
        expect(res.body.data.result.author).to.be.eql(idUserTest)
        expect(res.body.data.result.title).to.be.eql('thread1')
        idThread1 = res.body.data.result.id
        // private
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'threadPrivate', content: 'testing content private', private: true })
          .set('Authorization', tokenUserTest)
        expectSuccess(res, 201)
        expect(res.body.data.result).to.include.all.keys('title', 'id', 'content', 'author')
        expect(res.body.data.result.author).to.be.eql(idUserTest)
        expect(res.body.data.result.title).to.be.eql('threadPrivate')
        idPrivated = res.body.data.result.id
      })

      it('it should not Create thread with same title', async function () {
        res = await chai.request(server).post('/api/v1/threads')
          .send({ title: 'thread1', content: 'testing content22222' })
        expectErrors(res)
      })

    })
    describe(`[GET]\t/api/v1/threads/`, function () {

      it('it should GET all threads as guest or logged in', async function () {
        resGuest = await chai.request(server).get('/api/v1/threads')
        expectSuccess(resGuest)
        expect(resGuest.body.data.result).to.be.a('array')
        resUser = await chai.request(server).get('/api/v1/threads')
          .set('Authorization', tokenUserTest)
        expectSuccess(resUser)
        expect(resUser.body.data.result).to.be.a('array')

        expect(resUser.body.data.result).to.be.eql(resGuest.body.data.result)
      })

      it('it should has error if there is junk body or params', async function () {
        res = await chai.request(server).get('/api/v1/threads')
          .send({ junk: '123' })
        expectErrors(res)
        res = await chai.request(server).get('/api/v1/threads/?asd=1')
          .send({ junk: '123' })
        expectErrors(res)
      })

    })

    describe(`[GET]\t/api/v1/threads:threadId/`, function () {

      it('it should GET a thread not privated as guest or logged in', async function () {
        resGuest = await chai.request(server).get('/api/v1/threads/' + idThread1)
        expectSuccess(resGuest)
        expect(resGuest.body.data.result).to.include.all.keys('title', 'content', 'id')
        expect(resGuest.body.data.result.id).eql(idThread1)
        resUser = await chai.request(server).get('/api/v1/threads/' + idThread1)
          .set('Authorization', tokenUserTest)
        expectSuccess(resUser)
        expect(resUser.body.data.result).to.include.all.keys('title', 'content', 'id')
        expect(resUser.body.data.result.id).eql(idThread1)

        expect(resUser.body.data.result).to.be.eql(resGuest.body.data.result)
      })

      it('it should has error if there is junk body or params', async function () {
        res = await chai.request(server).get('/api/v1/threads/' + idThread1)
          .send({ junk: '123' })
        expectErrors(res)
        res = await chai.request(server).get('/api/v1/threads/' + idThread1 + '?asd=1')
          .send({ junk: '123' })
        expectErrors(res)
      })

      it('it should GET a thread privated only by logged in users', async function () {
        resGuest = await chai.request(server).get('/api/v1/threads/' + idPrivated)
        expectErrors(resGuest)

        resUser = await chai.request(server).get('/api/v1/threads/' + idPrivated)
          .set('Authorization', tokenUserTest)
        expectSuccess(resUser)
        expect(resUser.body.data.result).to.include.all.keys('title', 'content', 'id')
        expect(resUser.body.data.result.id).eql(idPrivated)
      })

    })

    describe(`[PATCH]\t/api/v1/threads:threadId/`, function () {

      it('it should not PATCH a thread ', async function () {
        resGuest = await chai.request(server).patch('/api/v1/threads/' + idThread1)
        expectErrors(resGuest)
        resUser = await chai.request(server).patch('/api/v1/threads/' + idThread1)
          .set('Authorization', tokenModeratorTest)
        expectErrors(resUser)
        resUser = await chai.request(server).patch('/api/v1/threads/' + idThread1 + '?asd=1')
          .send({ junk: '123' })
          .set('Authorization', tokenUserTest)
        expectErrors(resUser)
      })

      it('it should PATCH a thread only by Owner or Admin', async function () {

        resUser = await chai.request(server).patch('/api/v1/threads/' + idPrivated)
          .set('Authorization', tokenUserTest)
          .send({ private: false })
        expectSuccess(resUser)
        expect(resUser.body.data.result).to.include.all.keys('title', 'content', 'id')
        expect(resUser.body.data.result.id).eql(idPrivated)
        resUser = await chai.request(server).patch('/api/v1/threads/' + idPrivated)
          .set('Authorization', tokenSuperAdmin)
          .send({ private: true })
        expect(resUser.body.data.result).to.include.all.keys('title', 'content', 'id')
        expect(resUser.body.data.result.id).eql(idPrivated)
      })

    })

    describe(`[DELETE]\t/api/v1/threads:threadId/`, function () {

      it('it should not DELETE a thread ', async function () {
        resGuest = await chai.request(server).delete('/api/v1/threads/' + idThread1)
        expectErrors(resGuest)
        resUser = await chai.request(server).delete('/api/v1/threads/' + idThread1)
          .set('Authorization', tokenModeratorTest)
        expectErrors(resUser)
        resUser = await chai.request(server).delete('/api/v1/threads/' + idThread1 + '?asd=1')
          .send({ junk: '123' })
          .set('Authorization', tokenUserTest)
        expectErrors(resUser)
      })

      it('it should DELETE a thread only by Owner or Admin', async function () {

        resUser = await chai.request(server).delete('/api/v1/threads/' + idPrivated)
          .set('Authorization', tokenUserTest)
        expectSuccess(resUser)
        expect(resUser.body.data.result).to.include.all.keys('message')

        resUser = await chai.request(server).delete('/api/v1/threads/' + idPrivated)
          .set('Authorization', tokenSuperAdmin)
        expectErrors(resUser)
        // if Thread not found, means that if not deleted before will be deleting this.. so is ok
        expect(resUser.body.errors[0].code).eql('REQUEST_THREAD_NOT_FOUND')
      })

    })

    // TODO TEST PIN AND LIKES!


    describe(`[POST]\t/api/v1/threads:threadId/comments/`, function () {
      it('it should not create a comment if not logged in or junk request', async function () {
        res = await chai.request(server).post('/api/v1/threads/' + idThread1 + '/comments')
          .send({ content: 'comentario boludo' })
        expectErrors(res)

        res = await chai.request(server).post('/api/v1/threads/' + idThread1 + '/comments')
          .set('Authorization', tokenUserTest)
        expectErrors(res)

        res = await chai.request(server).post('/api/v1/threads/' + idThread1 + '/comments' + '?asd=1')
          .set('Authorization', tokenUserTest)
          .send({ junk: '123' })
        expectErrors(res)

      })

      it('it should Create a comment', async function () {
        res = await chai.request(server).post('/api/v1/threads/' + idThread1 + '/comments')
          .set('Authorization', tokenUserTest)
          .send({ content: 'this is a test comment' })
        expectSuccess(res, 201)
        expect(res.body.data.result).to.include.all.keys('author', 'content', 'id')
      })
    })
    let commentId
    describe(`[GET]\t/api/v1/threads:threadId/comments/`, function () {
      it('it should not get all comments if junk request or bad id', async function () {

        res = await chai.request(server).get('/api/v1/threads/' + 132132132 + '/comments')
        expectErrors(res)

        res = await chai.request(server).get('/api/v1/threads/' + idThread1 + '/comments')
          .send({ content: 'this is a junk' })
        expectErrors(res)
      })

      it('it should get all comments', async function () {
        // TODO TEST PRIVATE THREADS
        res = await chai.request(server).get('/api/v1/threads/' + idThread1 + '/comments')
        expectSuccess(res)
        expect(res.body.data.result).to.be.a('array')
        expect(res.body.data.result[0]).to.include.all.keys('author', 'content', 'id')
        commentId = res.body.data.result[0].id

      })

    })

    describe(`[GET]\t/api/v1/threads:threadId/comments/:commentId/`, function () {
      it('it should not get a comments if junk request or bad id', async function () {


        res = await chai.request(server).get('/api/v1/threads/' + idThread1 + '/comments/' + commentId)
          .set('Authorization', tokenUserTest)
          .send({ junk: 'asd' })
        expectErrors(res)
        res = await chai.request(server).get('/api/v1/threads/' + 123123123123123 + '/comments/' + commentId)
          .set('Authorization', tokenUserTest)
          .send({ junk: 'asd' })
        expectErrors(res)
      })
      it('it should get a comments if logged or not on public threads', async function () {

        res = await chai.request(server).get('/api/v1/threads/' + idThread1 + '/comments/' + commentId)
          .set('Authorization', tokenUserTest)
        expectSuccess(res)

        res = await chai.request(server).get('/api/v1/threads/' + idThread1 + '/comments/' + commentId)
        expectSuccess(res)

        //deletes tries

      })

    })

    describe(`[DELETE]\t/api/v1/threads:threadId/comments/:commentId/`, function () {
      it('it should not delete a comments if junk request or not owner/admin', async function () {

        res = await chai.request(server).delete('/api/v1/threads/' + idThread1 + '/comments/' + commentId)
          .set('Authorization', tokenModeratorTest)
        expectErrors(res)

        res = await chai.request(server).delete('/api/v1/threads/' + idThread1 + '/comments/' + commentId)
          .set('Authorization', tokenUserTest)
          .send({ junk: 'asd' })
        expectErrors(res)


      })
      it('it should delete a comment if owner/admin', async function () {
        res = await chai.request(server).delete('/api/v1/threads/' + idThread1 + '/comments/' + commentId)
          .set('Authorization', tokenUserTest)
        expectSuccess(res)
      })
    })

  })

}
module.exports.execute = execute