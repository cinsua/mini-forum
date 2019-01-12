const Thread = require('../models/thread')
const Comment = require('../models/comment')
const { newError } = require('../utils/customErrors')

async function getPaginateCommentQuery(comment, readFields, queryUrl) {
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

async function getCommentQuery(commentId, queryUrl) {
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

  async getAll(thread, readFields, queryUrl) {
    //TODO if filter in query in url remove the rest
    let query = getPaginateCommentQuery({ thread: thread.id }, readFields, queryUrl)

    let commentsAndPaginationInfo = await query

    let comments = commentsAndPaginationInfo.docs
    delete commentsAndPaginationInfo.docs
    let paginationInfo = commentsAndPaginationInfo

    return { comments, paginationInfo }

  },

  async getById(commentId, queryUrl) {

    let query = getCommentQuery(commentId, queryUrl)
    let comment = await query
    if (!comment) throw newError('REQUEST_THREAD_NOT_FOUND')

    return comment
  },

  async delete(comment) {
    await comment.delete()
    return
  },

}

