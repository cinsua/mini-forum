const ThreadService = require('../services/thread');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')
const rolesLevels = require('../models/roles').levels
const utils = require('../utils/utils')

module.exports = {

  createThread: async (req, res, next) => {
    const { title, content, private } = req.validRequest.body
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

  update: async (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    thread = await ThreadService.getById(threadId)
    checkThreadOwner(thread, req.user, req.credentials)

    //console.log(req.credentials.bestRole)
    if (req.credentials.bestRole == 'user')
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES');
    
    const updThread = req.validRequest.body

    thread = await ThreadService.update(thread, updThread)
    
    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)

    return next()
  },

  delete:async  (req, res, next) => {
    
    const threadId = req.validRequest.params.threadId
    thread = await ThreadService.getById(threadId)
    checkThreadOwner(thread, req.user, req.credentials)

    //console.log(req.credentials.bestRole)
    if (req.credentials.bestRole == 'user')
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES');

    thread = await ThreadService.delete(thread)
    
    req.data = ({message: 'Thread deleted'})

    return next()
  },

  // TODO check if pinned
  pin: async (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    thread = await ThreadService.getById(threadId)

    thread = await ThreadService.pinned(thread, true)
    
    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)

    return next()
  },

  // TODO check if pinned
  unpin:async  (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    thread = await ThreadService.getById(threadId)

    thread = await ThreadService.pinned(thread, false)
    
    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)

    return next()
  },

  like:async  (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    thread = await ThreadService.getById(threadId)

    thread = await ThreadService.like(thread, req.user)

    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)
    return next()
  },

  unlike: async (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    thread = await ThreadService.getById(threadId)

    thread = await ThreadService.unlike(thread, req.user)
    
    thread = utils.cleanResult(thread)
    req.data = hateoas.addLinks(thread, undefined, req.credentials, req.app.routes)
    
    return next()
  },
}

function checkThreadOwner(thread, reqUser, credentials){
  if (thread.author.id === reqUser.id){
    credentials.bestRole = 'owner'
  }
}