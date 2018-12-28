const Service = require('../services/user');
const ServicePenalty = require('../services/penalty');
const GetParams = require('../helpers/user');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')

// TODO move all penalties related to penalty controller

module.exports = {

  createUser: async (req, res, next) => {
    const { username, password } = req.validRequest.body
    user = await Service.create({ username, password })
    req.status = 201
    req.data = await hateoas.createUser(user)
    return next()
  },

  getAll: async (req, res, next) => {

    const queryUrl = req.validRequest.query
    const readFields = req.credentials.readFields

    data = await Service.getAll(readFields, queryUrl)

    req.data = data//{ users: users, message: 'List of users' }

    return next()
  },

  login: async (req, res, next) => {
    let { username, password } = req.validRequest.body
    let user = await Service.getByUsername(username);
    if (!user) throw newError('LOGIN_PW_UNAME_INVALID');
    
    access = await user.comparePassword(password);
    if (!access) throw newError('LOGIN_PW_UNAME_INVALID');

    if (user.banned) throw newError('LOGIN_USER_BANNED');

    req.data = { 
      token: user.getJWT(), 
      message: `Welcome ${user.username}`,
      links: {self: '/api/v1/users/me'} }

    return next()
  },

  // refactor this
  deleteMe: async (req, res, next) => {
    let user = await Service.deleteMe(req);
    req.data = { message: 'User logged in deleted' }

    return next()
  },

  // refactor this
  updateMe: async (req, res, next) => {
    user = await Service.updateMe(req)
    req.data = { user, message: 'Saved' }

    return next()
  },

  getById: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles)

    req.data = { user }

    return next()
  },

  // TODO FILTER
  getPenalties: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles)
    
    penalties = await ServicePenalty.getPenalties(user)
    req.data = { penalties, message: 'penalties' }

    return next()
  },

  // TODO FILTER
  getBans: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles)

    bans = await ServicePenalty.getBans(user)
    req.data = { bans, message: 'bans' }

    return next()
  },

  banUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles, false)

    ban = await ServicePenalty.create(req, user, 'ban')
    ban.populate('user').populate('author')
    //user = await Service.get(req)
    req.data = { ban }
    return next()
  },

  // TODO FILTER
  getSilences: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles)

    bans = await ServicePenalty.getSilences(user)
    req.data = { bans, message: 'silences' }

    return next()
  },

  silenceUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles, false)

    silence = await ServicePenalty.create(req, user, 'silence')
    silence.populate('user').populate('author')

    req.data = { silence }
    return next()
  },

  //TODO check > < for permissions
  addRole: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles, false)

    await GetParams.checkRole(user, req.body.role, req)
    await Service.addRol(user, req.body.role)

    req.data = { user, message: 'role added' }
    return next()
  },

  //TODO check > < for permissions
  removeRole: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles, false)

    await GetParams.checkRole(user, req.body.role, req, true)

    await Service.removeRol(user, req.body.role)
    req.data = { user, message: 'role removed' }

    return next()
  },

  removeBan: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles, false)

    ban = await ServicePenalty.getBan(user, req.params.banId)
    await ServicePenalty.deletePenalty(ban)
    req.data = { user, message: 'ban removed' }
    return next()
  },

  removeSilence: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query
    const roles = req.credentials.roles

    user = await Service.get(idOrUsername, readFields, queryUrl, roles, false)

    silence = await ServicePenalty.getSilence(user, req.params.silenceId)
    await ServicePenalty.deletePenalty(silence)
    req.data = { user, message: 'silence removed' }
    return next()
  }

}

