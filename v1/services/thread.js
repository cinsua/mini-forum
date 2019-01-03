const Thread = require('../models/thread');
const { newError } = require('../utils/customErrors')
// TODO delete req dependency
module.exports = {

  create: async ({ title, content, author, private = false }) => {

    let thread = new Thread({ title, content, author, private: false })
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

}

//TODO query url filter
async function getUserquery(userId, readFields, queryUrl) {

  userFields = readFields.user.join(' ')
  if (userFields == 'all') userFields = undefined

  penaltyFields = readFields.penalty.join(' ')
  population = { path: 'penalties' }
  if (!readFields.penalty.includes('none') &&
    !readFields.penalty.includes('all'))
    population.select = penaltyFields

  // check if req.params.id is an id or username
  try {
    idValid = new ObjectId(userId)
  } catch (e) {
    idValid = undefined
  }

  (userId != idValid) ?
    userQuery = User.findOne({ username: userId }) :
    userQuery = User.findById(userId)

  userQuery.select(userFields).populate(population)

  return userQuery

}

//TODO query url filter
async function getPaginateThreadQuery(thread, readFields, queryUrl) {

  //threadFields = readFields.user.join(' ')
  threadFields = 'title author content comments likes'

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
