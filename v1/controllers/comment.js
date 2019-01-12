const ThreadService = require('../services/thread')
const CommentService = require('../services/comment')
const utils = require('../utils/utils')

module.exports = {
  async createComment(req, res, next) {
    const { content } = req.validRequest.body
    const threadId = req.validRequest.params.threadId

    let thread = await ThreadService.getById(threadId, undefined)
    let comment = await CommentService.create({ content, thread: thread.id, author: req.user.id })

    req.status = 201

    req.data = comment

    return next()
  },

  async getAll(req, res, next) {

    const queryUrl = req.validRequest.query
    const threadId = req.validRequest.params.threadId

    let thread = await ThreadService.getById(threadId, undefined, queryUrl)

    await ThreadService.checkAccessToPrivate(thread, req.credentials)

    let { comments, paginationInfo } = await CommentService.getAll(thread, queryUrl)

    req.data = comments
    req.paginationInfo = paginationInfo

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

    req.data = comment

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
    req.data= { message: 'Comment deleted' }

    return next()
  },


}