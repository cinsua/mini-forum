const Service = require('../services/user');
const AuthError = require('../utils/customErrors').AuthError
const RoleError = require('../utils/customErrors').RoleError
const AdminError = require('../utils/customErrors').AdminError
const roles = require('../models/roles')
const Ban = require('../models/bans');
const User = require('../models/user');

module.exports = {

  createUser: async (req, res, next) => {
    user = await Service.create(req.body)
    req.status = 201
    req.data = { message: 'User Created', user: user.toWeb(), token: user.getJWT() }
    
    return next()
  },

  getMe: async (req, res, next) => {
    let user = req.user
    req.data = { user: user.toWeb(), message: 'You are logged in' }

    return next()
  },

  getAll:async(req, res, next) => {
    users = await Service.getAll()
    usersToWeb = []
    for (user of users){
      usersToWeb. push(user.toWeb())
    }
    req.data = { users: usersToWeb, message: 'List of users' }

    return next()
  },

  login: async (req, res, next) => {
    let user = await Service.getMe(req.body);
    if (!user) throw new AuthError('Username/password invalid', 'USPW_INV');

    access = await user.comparePassword(req.body.password);
    if (!access) throw new AuthError('Username/password invalid', 'USPW_INV');

    req.data = { token: user.getJWT(), user: user.toWeb(), message: `Welcome ${user.username}` }

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

}

