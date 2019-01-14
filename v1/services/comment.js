const Comment = require('../models/comment')
const { newError } = require('../utils/customErrors')

async function getPaginateCommentQuery(comment, queryUrl) {
  // for now, response is fixed
  let commentFields = 'author likes likesCounter content links'

  let { page = 1, limit = 20 } = queryUrl

  let pagination = {
    select: commentFields,
    sort: { createdAt: -1 },
    lean: false,
    page: Number(page),
    limit: Number(limit)
  }
  return Comment.paginate(comment, pagination)
}

async function getCommentQuery(commentId) {
  // for now, response is fixed
  let commentFields
  let commentQuery = Comment.findById(commentId)

  commentQuery.select(commentFields).populate([{ path: 'author', select: 'username id' }, { path: 'thread', select: 'title id' }])
  return commentQuery
}

module.exports = {

  async create({ content, thread, author }) {
    let comment = new Comment({ content, thread, author })
    await comment.save()

    return comment
  },

  async getAll(thread, queryUrl) {
    //TODO if filter in query in url remove the rest
    let query = getPaginateCommentQuery({ thread: thread.id }, queryUrl)

    let commentsAndPaginationInfo = await query

    let comments = commentsAndPaginationInfo.docs
    delete commentsAndPaginationInfo.docs
    let paginationInfo = commentsAndPaginationInfo

    return { comments, paginationInfo }

  },

  async getById(commentId) {

    let query = getCommentQuery(commentId)
    let comment = await query
    if (!comment) throw newError('REQUEST_THREAD_NOT_FOUND')

    return comment
  },

  async delete(comment) {
    await comment.delete()
    return
  },

  async checkCommentBelongsToThread(comment, thread) {

    if (!comment.thread._id.equals(thread._id))
      throw newError('REQUEST_COMMENT_HAS_DIFFERENT_THREAD')

  }

}

