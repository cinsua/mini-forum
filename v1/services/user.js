const User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId
const { newError } = require('../utils/customErrors')
const hateoas = require('./hateoas')

module.exports = {
  create: async ({ username, password }) => {
    //const { username, password } = body
    const user = new User({ username, password })
    user.roles.push('user')
    await user.save()
    return user
  },

  getAll: async (readFields, queryUrl) => {
    //TODO if filter in query in url remove the rest
    query = getPaginateUsersQuery({}, readFields, queryUrl)

    usersAndMetaData = await query
    // output
    // "docs":[user]
    // "total": 2,
    // "limit": 12,
    // "page": 1,
    // "pages": 1

    users = usersAndMetaData.docs
    delete usersAndMetaData.docs
    metaData = usersAndMetaData

    // TODO Services should not clean and hateoas
    users = cleanUsers(users, readFields, queryUrl)
    data = hateoas.listOfUsers(users, metaData)

    return data

  },

  // TODO Services should not clean and hateoas
  get: async (idOrUsername, readFields, queryUrl, roles, clean = true) => {

    query = getUserquery(idOrUsername, readFields, queryUrl)
    user = await query
    if (!user) throw newError('REQUEST_USER_NOT_FOUND');
    if (clean) {
      user = cleanUser(user, readFields, queryUrl)
      user = hateoas.singleUser(user, readFields, roles, queryUrl)
    }

    return user
  },

  // only for login
  getByUsername: async (username) => {

    query = getUserquery(username, {user: ['all'], penalty:['all']})
    let user = await query
    return user
  },

  deleteMe: async (req) => {
    const { user } = req
    await user.delete()
    return
  },

  updateMe: async (req) => {
    let user, data
    user = req.user;
    data = req.body;
    user.set(data);
    user = await user.save();
    return user
  },
  //*******

  update: async (user, updObj) => {
    user.set(updObj)
    user = await user.save();
    return user
  },

  addPenalty: async (user, penalty) => {
    user.penalties.push(penalty)
    user.save()
  },

  addRol: async (user, rol) => {
    user.roles.push(rol)
    user.save()
  },

  removeRol: async (user, rol) => {
    user.roles = user.roles.filter(r => r !== rol)
    //const filteredItems = items.filter(item => item !== valueToRemove)

    user.save()
  },
  removePenalty: async (user, penalty) => {
    user.roles = user.penalties.filter(p => p._id !== penalty.id)
    //const filteredItems = items.filter(item => item !== valueToRemove)

    user.save()
  }

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
async function getPaginateUsersQuery(user, readFields, queryUrl) {

  userFields = readFields.user.join(' ')

  if (userFields == 'all') userFields = undefined

  penaltyFields = readFields.penalty.join(' ')

  population = { path: 'penalties' }
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

function cleanUser(user, readFields, query) {

  user = user.toObject()
  if (!readFields.user.includes('penalties') && !readFields.user.includes('all')) delete user.penalties

  return user
}

function cleanUsers(users, readFields, query) {
  // can be map of cleanUser

  users = users.map((us) => (us.toObject()))

  if (!readFields.user.includes('penalties') && !readFields.user.includes('all')) {
    users = users.map(({ penalties, ...restOfUser }) => restOfUser)
  }
  return users
}