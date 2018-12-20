const Service = require('../services/user');
const ServicePenalty = require('../services/penalty');
const AuthError = require('../utils/customErrors').AuthError
const GetParams = require('../helpers/user');

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

    req.data = { user: await user.toWeb(req.permissions.role) }

    return next()
  },

  getPenalties: async (req, res, next) => {
    //user = await Service.updateMe(req)
    req.data = { user: user.penalties, message: 'penalties' }

    return next()
  },

  banUser: async (req, res, next) => {
    user = await Service.get(req)
    if (!user) throw new Error('user not found')
    let ban = await ServicePenalty.create(req, user, 'ban')
    user.populate('penalties').populate('author')
    req.data = { ban }
    return next()
  }

}

