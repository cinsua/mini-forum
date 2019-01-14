const ThreadService = require('../services/thread')
const CommentService = require('../services/comment')

async function _getCommentFromThread(req) {
  
  let thread = await ThreadService.getById(req.validRequest.params.threadId)
  await ThreadService.checkAccessToPrivate(thread, req.credentials)
  
  let comment = await CommentService.getById(req.validRequest.params.commentId)
  await CommentService.checkCommentBelongsToThread(comment, thread)
  return { comment, thread }
}

module.exports = {
  async createComment(req, res, next) {

    let thread = await ThreadService.getById(req.validRequest.params.threadId)
    let comment = await CommentService.create({
      content: req.validRequest.body.content,
      thread: thread.id,
      author: req.user.id
    })

    req.status = 201

    req.data = comment

    return next()
  },

  async getAll(req, res, next) {

    let thread = await ThreadService.getById(req.validRequest.params.threadId)
    await ThreadService.checkAccessToPrivate(thread, req.credentials)

    let { comments, paginationInfo } = await CommentService.getAll(thread, req.validRequest.query)

    req.data = comments
    req.paginationInfo = paginationInfo

    return next()
  },

  async getById(req, res, next) {

    let { comment } = await _getCommentFromThread(req)
    //console.log(comment)
    req.data = comment

    return next()
  },

  async delete(req, res, next) {

    let { comment } = await _getCommentFromThread(req)

    comment = await CommentService.delete(comment)
    req.data = { message: 'Comment deleted' }

    return next()
  },


}
