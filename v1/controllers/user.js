const Service = require('../services/user');
const ServicePenalty = require('../services/penalty');
const AuthError = require('../utils/customErrors').AuthError
const GetParams = require('../helpers/user');
const roles = require('../models/roles')

module.exports = {

  createUser: async (req, res, next) => {
    //console.log(GetParams.forCreateUser(req))
    user = await Service.create(GetParams.forCreateUser(req))
    req.status = 201
    req.data = { message: 'User Created', user: await user.toWeb(req.permissions.role), token: user.getJWT() }

    return next()
  },

  getAll: async (req, res, next) => {

    users = await Service.getAll(req)
    //users = await Promise.all( users.map( user => user.toWeb(req.permissions.role)))

    req.data = { users: users, message: 'List of users' }

    return next()
  },

  login: async (req, res, next) => {
    let user = await Service.getMe(req.body);
    if (!user) throw new AuthError('Username/password invalid', 'USPW_INV');

    access = await user.comparePassword(req.body.password);
    if (!access) throw new AuthError('Username/password invalid', 'USPW_INV');

    if (user.banned) {
      return next(new AuthError('User is banned', 'USR_BANNED'))
    }

    req.data = { token: user.getJWT(), user: await user.toWeb(req.permissions.role), message: `Welcome ${user.username}` }

    return next()
  },

  deleteMe: async (req, res, next) => {
    let user = await Service.deleteMe(req);
    req.data = { user, message: 'User logged in deleted' }

    return next()
  },

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
    if (!user) throw new Error('user not found')
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
    if (!user) throw new Error('user not found')
    silence = await ServicePenalty.create(req, user, 'silence')
    silence.populate('user').populate('author')
    //user = await Service.get(req)
    req.data = { silence }
    return next()
  },

  //TODO check > < for permissions
  addRol: async (req, res, next) => {
    user = await Service.get(req, false)
    await GetParams.checkRol(user, req.body.rol)
    await Service.addRol(user, req.body.rol)

    req.data = { user, message: 'rol added' }
    return next()
  },
  
  //TODO check > < for permissions
  removeRol:async (req, res, next) => {
    user = await Service.get(req, false)
    await GetParams.checkRol(user, req.body.rol, true)

    await Service.removeRol(user, req.body.rol)
    req.data = { user, message: 'rol removed' }

    return next()
  },

  removeBan:async (req, res, next) => {
    user = await Service.get(req, false)
    ban = await ServicePenalty.getBan(user, req.params.banId)
    await ServicePenalty.deletePenalty(ban)
    req.data = { user, message: 'ban removed' }
    return next()
  },

  removeSilence:async (req, res, next) => {
    user = await Service.get(req, false)
    silence = await ServicePenalty.getSilence(user, req.params.silenceId)
    await ServicePenalty.deletePenalty(silence)
    req.data = { user, message: 'silence removed' }
    return next()
  }


}

