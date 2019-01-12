const UserService = require('../services/user')
const { newError } = require('../utils/customErrors')
const rolesLevels = require('../models/roles').levels

// refactor this, must clean from fields
function cleanUser(user, readFields, query) {
  user = user.toObject()
  if (!readFields.user.includes('penalties') && !readFields.user.includes('all')) delete user.penalties
  return user
}

function cleanUsers(users, readFields, query) {
  users = users.map((us) => (cleanUser(us, readFields, query)))
  return users
}

module.exports = {

  async createUser(req, res, next) {
    const { username, password } = req.validRequest.body

    let user = await UserService.create({ username, password })

    req.status = 201
    user = await cleanUser(user, req.credentials.readFields, req.validRequest.query)
    req.data = user

    return next()
  },

  async getAll(req, res, next) {

    const queryUrl = req.validRequest.query
    const readFields = req.credentials.readFields

    let { users, paginationInfo } = await UserService.getAll(readFields, queryUrl)

    users = await cleanUsers(users, readFields, queryUrl)
    req.data = users
    req.paginationInfo = paginationInfo

    return next()
  },

  async login(req, res, next) {
    let { username, password } = req.validRequest.body

    let user = await UserService.getByUsername(username)
    if (!user) throw newError('LOGIN_PW_UNAME_INVALID')

    let access = await user.comparePassword(password)
    if (!access) throw newError('LOGIN_PW_UNAME_INVALID')

    if (user.banned) throw newError('LOGIN_USER_BANNED')

    let data = {
      token: user.getJWT(),
      id: user.id,
      message: `Welcome ${user.username}`,
      links: { type: 'GET', rel: 'self', href: '/api/v1/users/me' }
    }
    req.data = data

    return next()
  },

  // refactor this
  async deleteMe(req, res, next) {
    let user = await UserService.deleteMe(req)
    req.data = { message: 'User logged in deleted' }

    return next()
  },

  // refactor this
  async updateMe(req, res, next) {
    let user = await UserService.updateMe(req)
    req.data = { user, message: 'Saved' }

    return next()
  },

  async getById(req, res, next) {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    user = await cleanUser(user, readFields, queryUrl)
    req.data = user

    return next()
  },

  async addRole(req, res, next) {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const role = req.validRequest.body.role

    if (user.roles.includes(role))
      throw newError('ASSIGNMENT_ROLE_ALREADY_PRESENT')

    if (rolesLevels[role] >= rolesLevels[req.credentials.bestRole])
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')

    await UserService.addRol(user, role)

    let data = { message: `role [${role}] added to user [${user.username}]` }
    req.data = data

    return next()
  },

  async removeRole(req, res, next) {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const role = req.validRequest.body.role

    if (!user.roles.includes(role))
      throw newError('ASSIGNMENT_ROLE_NOT_PRESENT')

    if (rolesLevels[role] >= rolesLevels[req.credentials.bestRole])
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')

    await UserService.removeRol(user, req.body.role)

    let data = { message: `role [${role}] deleted from user [${user.username}]` }
    req.data = data

    return next()
  },

}


