const ThreadService = require('../services/thread')
const CommentService = require('../services/comment')
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')
const utils = require('../utils/utils')

module.exports = {
  async createComment(req, res, next) {
    const { content } = req.validRequest.body
    const threadId = req.validRequest.params.threadId

    let thread = await ThreadService.getById(threadId, undefined)
    let comment = await CommentService.create({ content, thread: thread.id, author: req.user.id })

    req.status = 201

    comment = utils.cleanResult(comment)
    req.data = hateoas.addLinks(comment, req.credentials, req.app.routes)

    return next()
  },

  async getAll(req, res, next) {

    const queryUrl = req.validRequest.query
    const threadId = req.validRequest.params.threadId

    let thread = await ThreadService.getById(threadId, undefined, queryUrl)

    await ThreadService.checkAccessToPrivate(thread, req.credentials)

    let { comments, paginationInfo } = await CommentService.getAll(thread, queryUrl)

    comments = utils.cleanResult(comments)
    req.data = hateoas.addLinks(comments, req.credentials, req.app.routes)

    return next()
  },

  async getById(req, res, next) {
    const threadId = req.validRequest.params.threadId
    const commentId = req.validRequest.params.commentId
    const queryUrl = req.validRequest.query

    let thread = await ThreadService.getById(threadId, queryUrl)

    await ThreadService.checkAccessToPrivate(thread, req.credentials)

    let comment = await CommentService.getById(commentId)

    await CommentService.checkCommentBelongsToThread(comment, thread)

    comment = utils.cleanResult(comment)
    req.data = hateoas.addLinks(comment, req.credentials, req.app.routes)

    return next()
  },

  async delete(req, res, next) {

    const threadId = req.validRequest.params.threadId
    const commentId = req.validRequest.params.commentId
    const queryUrl = req.validRequest.query

    let thread = await ThreadService.getById(threadId, queryUrl)
    await ThreadService.checkAccessToPrivate(thread, req.credentials)

    let comment = await CommentService.getById(commentId)

    await CommentService.checkCommentBelongsToThread(comment, thread)

    comment = await CommentService.delete(comment)
    req.data = {}
    req.data.result = ({ message: 'Comment deleted' })

    return next()
  },


}