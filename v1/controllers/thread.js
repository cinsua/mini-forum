const ThreadService = require('../services/thread')
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')
const rolesLevels = require('../models/roles').levels
const utils = require('../utils/utils')

module.exports = {

  async createThread(req, res, next) {
    const { title, content, private } = req.validRequest.body
    let thread = await ThreadService.create({ title, content, author: req.user.id, private })
    thread = utils.cleanResult(thread)

    req.status = 201
    //user = cleanUser(user, req.credentials.readFields, req.validRequest.query)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)

    return next()
  },

  async getAll(req, res, next) {

    const queryUrl = req.validRequest.query
    const readFields = req.credentials.readFields

    let { threads, paginationInfo } = await ThreadService.getAll(readFields, queryUrl)

    threads = utils.cleanResult(threads)
    req.data = hateoas.addLinks(threads, req.credentials, req.app.routes, { paginationInfo })

    return next()
  },

  async getById(req, res, next) {
    const threadId = req.validRequest.params.threadId
    const queryUrl = req.validRequest.query

    let thread = await ThreadService.getById(threadId, queryUrl)

    // TODO to avoid duplicate code and future headpain pls move this to a thread service
    if (thread.private && req.credentials.bestRole == 'guest')
      throw newError('REQUEST_THREAD_IS_PRIVATED')

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)

    return next()
  },

  async update(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    if (req.credentials.bestRole == 'user')
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')

    const updThread = req.validRequest.body

    thread = await ThreadService.update(thread, updThread)

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)

    return next()
  },

  async delete(req, res, next) {

    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    if (req.credentials.bestRole == 'user')
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')

    thread = await ThreadService.delete(thread)
    req.data = {}
    req.data.result = ({ message: 'Thread deleted' })

    return next()
  },

  // TODO check if pinned
  async pin(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.pinned(thread, true)

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)

    return next()
  },

  // TODO check if pinned
  async unpin(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.pinned(thread, false)

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)

    return next()
  },

  async like(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.like(thread, req.user)

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)
    return next()
  },

  async unlike(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.unlike(thread, req.user)

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, req.credentials, req.app.routes)

    return next()
  },
}
