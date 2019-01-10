const ThreadService = require('../services/thread');
const CommentService = require('../services/comment');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')
const rolesLevels = require('../models/roles').levels
const utils = require('../utils/utils')

module.exports = {
  createComment: async (req, res, next) => {
    const { content } = req.validRequest.body
    const threadId = req.validRequest.params.threadId

    thread = await ThreadService.getById(threadId, undefined)
    comment = await CommentService.create({ content, thread: thread.id, author: req.user.id })

    req.status = 201
    //thread = await ThreadService.getById(threadId, undefined)
    comment = utils.cleanResult(comment)
    req.data = hateoas.addLinks(comment, undefined, req.credentials, req.app.routes)

    return next()
  },

  getAll: async (req, res, next) => {

    const queryUrl = req.validRequest.query
    const readFields = req.credentials.readFields
    const threadId = req.validRequest.params.threadId

    thread = await ThreadService.getById(threadId, undefined, queryUrl)

    // TODO to avoid duplicate code and future headpain pls move this to a thread service
    if (thread.private && req.credentials.bestRole == 'guest')
      throw newError('REQUEST_THREAD_IS_PRIVATED');


    let { comments, paginationInfo } = await CommentService.getAll(thread, readFields, queryUrl)

    comments = utils.cleanResult(comments)
    req.data = hateoas.addLinks(comments, paginationInfo, req.credentials, req.app.routes)

    return next()
  },

  getById: async (req, res, next) => {
    const threadId = req.validRequest.params.threadId
    const commentId = req.validRequest.params.commentId
    const queryUrl = req.validRequest.query

    thread = await ThreadService.getById(threadId, queryUrl)

    //console.log(req.credentials.roles, req.credentials.bestRole)

    // TODO to avoid duplicate code and future headpain pls move this to a thread service
    if (thread.private && req.credentials.bestRole == 'guest')
      throw newError('REQUEST_THREAD_IS_PRIVATED');

    // TODO to avoid duplicate code and future headpain pls move this to a comment service
    comment = await CommentService.getById(commentId, queryUrl)
    if (comment.thread.id !== threadId)
      throw newError('REQUEST_COMMENT_HAS_DIFFERENT_THREAD');
    
    

    comment = utils.cleanResult(comment)
    req.data = hateoas.addLinks(comment, undefined, req.credentials, req.app.routes)

    return next()
  },

  delete:async  (req, res, next) => {
    
    const threadId = req.validRequest.params.threadId
    const commentId = req.validRequest.params.commentId
    const queryUrl = req.validRequest.query

    thread = await ThreadService.getById(threadId, queryUrl)
    
    // TODO to avoid duplicate code and future headpain pls move this to a thread service
    if (thread.private && req.credentials.bestRole == 'guest')
      throw newError('REQUEST_THREAD_IS_PRIVATED');

    // TODO to avoid duplicate code and future headpain pls move this to a comment service
    comment = await CommentService.getById(commentId, queryUrl)
    if (comment.thread.id !== threadId)
      throw newError('REQUEST_COMMENT_HAS_DIFFERENT_THREAD');

    //if (req.credentials.bestRole == 'user')
    //  throw newError('AUTH_INSUFFICIENT_PRIVILEGES');

    comment = await CommentService.delete(comment)
    req.data = {}
    req.data.result = ({message: 'Comment deleted'})

    return next()
  },


}