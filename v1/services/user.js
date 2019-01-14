const User = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId
const { newError } = require('../utils/customErrors')

//TODO query url filter
async function getUserquery(userId, readFields, queryUrl) {

  let fields = readFields.user.join(' ')
  let userFields
  if (fields !== 'all') userFields = fields

  let penaltyFields = readFields.penalty.join(' ')
  let population = { path: 'penalties' }
  if (!readFields.penalty.includes('none') &&
    !readFields.penalty.includes('all'))
    population.select = penaltyFields

  let userQuery = (ObjectId.isValid(userId)) ?
    User.findById(userId) :
    User.findOne({ username: userId })

  userQuery.select(userFields).populate(population)
  return userQuery
}

//TODO query url filter
async function getPaginateUsersQuery(user, readFields, queryUrl) {

  let fields = readFields.user.join(' ')
  let userFields
  if (fields !== 'all')
    userFields = fields

  let penaltyFields = readFields.penalty.join(' ')

  let population = { path: 'penalties' }
  if (!readFields.penalty.includes('none') &&
    !readFields.penalty.includes('all'))
    population.select = penaltyFields

  // TODO this should be extract from config
  let { page = 1, limit = 20 } = queryUrl

  let pagination = {
    select: userFields,
    sort: { createdAt: -1 },
    populate: population,
    lean: false,
    page: Number(page),
    limit: Number(limit)
  }
  return User.paginate(user, pagination)
}

module.exports = {
  async create({ username, password }) {
    //const { username, password } = body
    const user = new User({ username, password })
    user.roles.push('user')
    await user.save()
    return user
  },

  async getAll(readFields, queryUrl) {
    //TODO if filter in query in url remove the rest
    let query = getPaginateUsersQuery({}, readFields, queryUrl)

    let usersAndPaginationInfo = await query
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

    let users = usersAndPaginationInfo.docs
    delete usersAndPaginationInfo.docs
    let paginationInfo = usersAndPaginationInfo

    return { users, paginationInfo }

  },

  async getByIdOrUsername(idOrUsername, readFields, queryUrl) {

    let query = getUserquery(idOrUsername, readFields, queryUrl)
    let user = await query
    if (!user) throw newError('REQUEST_USER_NOT_FOUND')

    return user
  },

  // only for login
  async getByUsername(username) {

    let query = getUserquery(username, { user: ['all'], penalty: ['all'] })
    let user = await query
    return user
  },

  // never used ? maybe deprecated
  async deleteMe(req) {
    const { user } = req
    await user.delete()
    return
  },

  // never used ? maybe deprecated
  async updateMe(req) {
    let user, data
    user = req.user
    data = req.body
    user.set(data)
    user = await user.save()
    return user
  },

  async update(user, updObj) {
    user.set(updObj)
    user = await user.save()
    return user
  },

  async addPenalty(user, penalty) {
    user.penalties.push(penalty)
    user.save()
  },

  async addRol(user, rol) {
    user.roles.push(rol)
    user.save()
  },

  async removeRol(user, rol) {
    user.roles = user.roles.filter((r) => (r !== rol))
    //const filteredItems = items.filter(item => item !== valueToRemove)

    user.save()
  },

}

