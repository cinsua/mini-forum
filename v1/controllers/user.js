const UserService = require('../services/user');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')
const rolesLevels = require('../models/roles').levels

// TODO move all penalties related to penalty controller

module.exports = {

  createUser: async (req, res, next) => {
    const { username, password } = req.validRequest.body
    user = await UserService.create({ username, password })
    req.status = 201
    req.data = await hateoas.createUser(user)
    return next()
  },

  getAll: async (req, res, next) => {

    const queryUrl = req.validRequest.query
    const readFields = req.credentials.readFields

    let {users, paginationInfo} = await UserService.getAll(readFields, queryUrl)
    
    users = cleanUsers(users, readFields, queryUrl)
    req.data = hateoas.listOfUsers(users, paginationInfo)

    return next()
  },

  login: async (req, res, next) => {
    let { username, password } = req.validRequest.body
    let user = await UserService.getByUsername(username);
    if (!user) throw newError('LOGIN_PW_UNAME_INVALID');

    access = await user.comparePassword(password);
    if (!access) throw newError('LOGIN_PW_UNAME_INVALID');

    if (user.banned) throw newError('LOGIN_USER_BANNED');

    req.data = {
      token: user.getJWT(),
      message: `Welcome ${user.username}`,
      links: { self: '/api/v1/users/me' }
    }

    return next()
  },

  // refactor this
  deleteMe: async (req, res, next) => {
    let user = await UserService.deleteMe(req);
    req.data = { message: 'User logged in deleted' }

    return next()
  },

  // refactor this
  updateMe: async (req, res, next) => {
    user = await UserService.updateMe(req)
    req.data = { user, message: 'Saved' }

    return next()
  },

  getById: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    user = cleanUser(user, readFields, queryUrl)
    user = await hateoas.singleUser(user, readFields, roles, queryUrl)

    req.data = { user }

    return next()
  },

  addRole: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    const role = req.validRequest.body.role

    if (user.roles.includes(role))
      throw newError('ASSIGNMENT_ROLE_ALREADY_PRESENT')

    if (rolesLevels[role] >= rolesLevels[req.credentials.bestRole])
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')

    await UserService.addRol(user, req.body.role)

    req.data = { user, message: 'role added' }
    return next()
  },

  removeRole: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    const role = req.validRequest.body.role
    if (!user.roles.includes(role))
      throw newError('ASSIGNMENT_ROLE_NOT_PRESENT')

    if (rolesLevels[role] >= rolesLevels[req.credentials.bestRole])
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')

    await UserService.removeRol(user, req.body.role)
    req.data = { user, message: 'role removed' }

    return next()
  },

}

function cleanUser(user, readFields, query) {

  user = user.toObject()
  if (!readFields.user.includes('penalties') && !readFields.user.includes('all')) delete user.penalties

  return user
}

function cleanUsers(users, readFields, query) {
  // can be map of cleanUser

  users = users.map((us) => (cleanUser(us, readFields, query)))

  //if (!readFields.user.includes('penalties') && !readFields.user.includes('all')) {
  //  users = users.map(({ penalties, ...restOfUser }) => restOfUser)
  //}
  return users
}
