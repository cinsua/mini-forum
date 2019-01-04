const ThreadService = require('../services/thread');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')
const rolesLevels = require('../models/roles').levels
const utils = require('../utils/utils')

module.exports = {

  createThread: async (req, res, next) => {
    const { title, content, private } = req.validRequest.body
    console.log('private ', private)
    thread = await ThreadService.create({ title, content, author: req.user.id, private })
    thread = utils.cleanResult(thread)

    req.status = 201
    //user = cleanUser(user, req.credentials.readFields, req.validRequest.query)
    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)

    return next()
  },

  getAll: async (req, res, next) => {

    const queryUrl = req.validRequest.query
    const readFields = req.credentials.readFields

    let { threads, paginationInfo } = await ThreadService.getAll(readFields, queryUrl)
    threads = utils.cleanResult(threads)

    //users = cleanUsers(users, readFields, queryUrl)
    req.data = hateoas.addLinks(threads, paginationInfo, req.credentials, req.app.routes)

    return next()
  },
  getById: async (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    const queryUrl = req.validRequest.query

    thread = await ThreadService.getById(threadId, queryUrl)

    if (thread.private && req.credentials.bestRole == 'guest')
      throw newError('REQUEST_THREAD_IS_PRIVATED');

    thread = utils.cleanResult(thread)

    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)

    return next()
  },
}