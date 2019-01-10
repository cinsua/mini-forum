const Thread = require('../models/thread');
const Comment = require('../models/comment');
const { newError } = require('../utils/customErrors')

module.exports = {

  create: async ({ content, thread, author }) => {
    let comment = new Comment({ content, thread, author})
    await comment.save()

    return comment
  },
  getAll: async (thread, readFields, queryUrl) => {
    //TODO if filter in query in url remove the rest
    query = getPaginateCommentQuery({thread: thread.id}, readFields, queryUrl)

    commentsAndPaginationInfo = await query
    /*
    usersAndPaginationInfo is: 
    Object = {
      "docs": [user],
      "total": 2,
      "limit": 12,
      "page": 1,
      "pages": 1
    }
    */

    comments = commentsAndPaginationInfo.docs
    delete commentsAndPaginationInfo.docs
    paginationInfo = commentsAndPaginationInfo

    return { comments, paginationInfo }

  },
  
}

async function getPaginateCommentQuery(comment, readFields, queryUrl) {
  // for now, response is fixed

  //threadFields = readFields.user.join(' ')
  // TODO define read fields in roles
  commentFields = 'author likes likesCounter content links'

  if (commentFields == 'all') commentFields = undefined

  let { page = 1, limit = 20 } = queryUrl

  let pagination = {
    select: commentFields,
    sort: { createdAt: -1 },
    //populate: [{ path: 'author', select: 'username' }],//population,
    lean: false,
    page: Number(page),
    limit: Number(limit)
  }

  return Comment.paginate(comment, pagination)

}