const ThreadService = require('../services/thread')
const LikesService = require('../services/likes')
const utils = require('../utils/utils')

module.exports = {

  async createThread(req, res, next) {
    const { title, content, private } = req.validRequest.body
    let thread = await ThreadService.create({ title, content, author: req.user.id, private })


    req.status = 201
    //user = cleanUser(user, req.credentials.readFields, req.validRequest.query)
    req.data = thread
    return next()
  },

  async getAll(req, res, next) {

    const queryUrl = req.validRequest.query

    let { threads, paginationInfo } = await ThreadService.getAll(queryUrl)

    req.data = threads
    req.paginationInfo = paginationInfo
  
    return next()
  },

  async getById(req, res, next) {
    const threadId = req.validRequest.params.threadId

    let thread = await ThreadService.getById(threadId)

    await ThreadService.checkAccessToPrivate(thread, req.credentials)

    req.data = thread

    return next()
  },

  async update(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    const updThread = req.validRequest.body

    thread = await ThreadService.update(thread, updThread)

    req.data = thread

    return next()
  },

  async delete(req, res, next) {

    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.delete(thread)
    req.data = { message: 'Thread deleted' }

    return next()
  },

  // TODO check if pinned
  async pin(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.pinned(thread, true)

    req.data = thread

    return next()
  },

  // TODO check if pinned
  async unpin(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await ThreadService.pinned(thread, false)

    req.data = thread

    return next()
  },

  async like(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await LikesService.like(thread, req.user)

    req.data = thread
    return next()
  },

  async unlike(req, res, next) {
    const threadId = req.validRequest.params.threadId
    let thread = await ThreadService.getById(threadId)

    thread = await LikesService.unlike(thread, req.user)

    req.data = thread

    return next()
  },
}
