const Service = require('../services/user');
const ServicePenalty = require('../services/penalty');
const GetParams = require('../helpers/user');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')

module.exports = {

  createUser: async (req, res, next) => {
    user = await Service.create(GetParams.forCreateUser(req))
    req.status = 201
    req.data = await hateoas.createUser(user)
    return next()
  },

  getAll: async (req, res, next) => {

    data = await Service.getAll(req)

    req.data = data//{ users: users, message: 'List of users' }

    return next()
  },

  login: async (req, res, next) => {
    let { username, password } = GetParams.forLoginUser(req)
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
    // supported /:id /me /:username
    user = await Service.get(req)

    req.data = { user }

    return next()
  },

  // TODO FILTER
  getPenalties: async (req, res, next) => {
    user = await Service.get(req)
    penalties = await ServicePenalty.getPenalties(user)
    req.data = { penalties, message: 'penalties' }

    return next()
  },

  // TODO FILTER
  getBans: async (req, res, next) => {
    //user = await Service.updateMe(req)
    user = await Service.get(req)
    bans = await ServicePenalty.getBans(user)
    req.data = { bans, message: 'bans' }

    return next()
  },

  banUser: async (req, res, next) => {
    user = await Service.get(req, false)
    ban = await ServicePenalty.create(req, user, 'ban')
    ban.populate('user').populate('author')
    //user = await Service.get(req)
    req.data = { ban }
    return next()
  },

  // TODO FILTER
  getSilences: async (req, res, next) => {
    //user = await Service.updateMe(req)
    user = await Service.get(req)
    bans = await ServicePenalty.getSilences(user)
    req.data = { bans, message: 'silences' }

    return next()
  },

  silenceUser: async (req, res, next) => {
    user = await Service.get(req, false)
    silence = await ServicePenalty.create(req, user, 'silence')
    silence.populate('user').populate('author')
    //user = await Service.get(req)
    req.data = { silence }
    return next()
  },

  //TODO check > < for permissions
  addRole: async (req, res, next) => {
    user = await Service.get(req, false)
    await GetParams.checkRole(user, req.body.role, req)
    await Service.addRol(user, req.body.role)

    req.data = { user, message: 'role added' }
    return next()
  },

  //TODO check > < for permissions
  removeRole: async (req, res, next) => {
    user = await Service.get(req, false)
    await GetParams.checkRole(user, req.body.role, req, true)

    await Service.removeRol(user, req.body.role)
    req.data = { user, message: 'role removed' }

    return next()
  },

  removeBan: async (req, res, next) => {
    user = await Service.get(req, false)
    ban = await ServicePenalty.getBan(user, req.params.banId)
    await ServicePenalty.deletePenalty(ban)
    req.data = { user, message: 'ban removed' }
    return next()
  },

  removeSilence: async (req, res, next) => {
    user = await Service.get(req, false)
    silence = await ServicePenalty.getSilence(user, req.params.silenceId)
    await ServicePenalty.deletePenalty(silence)
    req.data = { user, message: 'silence removed' }
    return next()
  }


}

