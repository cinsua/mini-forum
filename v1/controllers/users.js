//const User = require('../models/users');
const Service = require('../services/users');

module.exports = {

  createUser: async (req, res, next) => {
    user = await Service.create(req.body)
    req.status = 201 // see http standar
    req.data = { message: 'User Created', user: user.toWeb(), token: user.getJWT() }
    return next()
  },

  getMe: async (req, res, next) => {
    let user = req.user
    req.status = 201
    req.data = { user: user.toWeb(), message: 'You are logged in' }
    return next()
  },

  login: async (req, res, next) => {
    let user = await Service.get(req.body);
    if (!user) throw Error('Username/password invalid');

    access = await user.comparePassword(req.body.password);
    if (!access) throw Error('Username/password invalid');

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
    //    .catch((e)=>{throw Error('Cannot save user')})
    //if(!user) throw Error('Cannot save user');
    req.data = { user, message: 'Saved' }
    return next()
  }

}