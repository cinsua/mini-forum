const Thread = require('../models/thread');
const Comment = require('../models/comment');
const { newError } = require('../utils/customErrors')
// TODO delete req dependency
module.exports = {

  create: async ({ title, content, author, private = false }) => {
    console.log('private srv', private)
    let thread = new Thread({ title, content, author, private})
    await thread.save()

    return thread
  },

  getAll: async (readFields, queryUrl) => {
    //TODO if filter in query in url remove the rest
    query = getPaginateThreadQuery({}, readFields, queryUrl)

    threadsAndPaginationInfo = await query
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

    threads = threadsAndPaginationInfo.docs
    delete threadsAndPaginationInfo.docs
    paginationInfo = threadsAndPaginationInfo

    return { threads, paginationInfo }

  },
  getById: async (threadId, queryUrl) => {

    query = getThreadQuery(threadId, queryUrl)
    thread = await query
    if (!thread) throw newError('REQUEST_THREAD_NOT_FOUND');

    return thread
  },

  update: async (threadId, updateInfo) => {

  }

}

//TODO query url filter
async function getThreadQuery(threadId, queryUrl) {

  // see fields
  threadFields = undefined
  /*
  penaltyFields = readFields.penalty.join(' ')
  population = { path: 'penalties' }
  if (!readFields.penalty.includes('none') &&
    !readFields.penalty.includes('all'))
    population.select = penaltyFields
  */
  threadQuery = Thread.findById(threadId)

  threadQuery.select(threadFields).populate([{ path: 'author', select: 'username' },{ path: 'comments', select: 'author.username content likes thread' }])

  return threadQuery

}

//TODO query url filter
async function getPaginateThreadQuery(thread, readFields, queryUrl) {

  //threadFields = readFields.user.join(' ')
  // TODO define read fields in roles
  threadFields = 'title author likes private'

  if (threadFields == 'all') threadFields = undefined
  /*
  penaltyFields = threadFields.penalty.join(' ')
 
  population = { path: 'penalties' }
  if (!threadFields.penalty.includes('none') &&
    !threadFields.penalty.includes('all'))
    population.select = penaltyFields
  */
  // TODO this should be extract from config
  let { page = 1, limit = 20 } = queryUrl

  let pagination = {
    select: threadFields,
    sort: { createdAt: -1 },
    populate: [{ path: 'author', select: 'username' }],//population,
    lean: false,
    page: Number(page),
    limit: Number(limit)
  }

  return Thread.paginate(thread, pagination)

}
