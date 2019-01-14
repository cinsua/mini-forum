const Thread = require('../models/thread')
const Comment = require('../models/comment')
const { newError } = require('../utils/customErrors')
// TODO delete req dependency
module.exports = {

  async create({ title, content, author, private = false }) {
    let thread = new Thread({ title, content, author, private })
    await thread.save()

    return thread
  },

  async getAll(queryUrl) {
    //TODO if filter in query in url remove the rest
    let query = getPaginateThreadQuery({}, queryUrl)

    let threadsAndPaginationInfo = await query
    /*
    usersAndPaginationInfo is: 
    Object = {
      'docs': [user],
      'total': 2,
      'limit': 12,
      'page': 1,
      'pages': 1
    }
    */

    let threads = threadsAndPaginationInfo.docs
    delete threadsAndPaginationInfo.docs
    let paginationInfo = threadsAndPaginationInfo

    return { threads, paginationInfo }
  },

  async getById(threadId) {

    let query = getThreadQuery(threadId)
    let thread = await query
    if (!thread) throw newError('REQUEST_THREAD_NOT_FOUND')

    return thread
  },

  async update(thread, updateInfo) {
    thread.set(updateInfo)
    thread = await thread.save()
    return thread
  },

  async delete(thread) {
    await thread.delete()
    return
  },

  async pinned(thread, pin) {
    thread.pinned = pin
    thread = await thread.save()
    return thread
  },

  async checkAccessToPrivate(thread, credentials){
    if (thread.private && credentials.bestRole === 'guest')
      throw newError('REQUEST_THREAD_IS_PRIVATED')
  }

}

//TODO query url filter
async function getThreadQuery(threadId) {

  let threadFields// = 'title author private pinned likes likesCounter links'
  let threadQuery = Thread.findById(threadId)

  threadQuery.select(threadFields)
    .populate([{ path: 'author', select: 'username' },
    { path: 'comments', select: 'author content thread likesCounter' }])
  return threadQuery

}

//TODO query url filter
async function getPaginateThreadQuery(thread, queryUrl) {
  // for now, response is fixed

  //threadFields = readFields.user.join(' ')
  // TODO define read fields in roles
  let threadFields = 'title author likes likesCounter private pinned'

  if (threadFields == 'all') threadFields = undefined

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
