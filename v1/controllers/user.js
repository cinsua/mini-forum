const Service = require('../services/user');
const AuthError = require('../utils/customErrors').AuthError

module.exports = {

  createUser: async (req, res, next) => {
    user = await Service.create(req.body)
    req.status = 201
    req.data = { message: 'User Created', user: user.toWeb(), token: user.getJWT() }

    return next()
  },

  getMe: async (req, res, next) => {
    console.log('im on getme')
    let user = req.user
    req.data = { user: user.toWeb(), message: 'You are logged in' }

    return next()
  },

  getAll:async(req, res, next) => {
    console.log('im on all')
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

    if (user.banned){
      return next(new AuthError('User is banned', 'USR_BANNED'))
    }

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

  getById: async (req, res, next) => {
    // if data is loaded, means that another match route already was fired. so skip this one
    // in this case, if we call users/me, that route already charge the user, and this one dont have
    // nothing to do
    // maybe is better implement 'req.readyToSend'
    if (req.data) return next()

    /*
    // this no longer needed. we check for data
    if (req.params.id === 'me' || req.params.id === 'login') {
      console.log('getbyid param: ',req.params.id)
      return next()
    }
    */

    if (req.params.id === req.user.id){

      return res.redirect(req.baseUrl + '/me')
    }
    
    user = await Service.get(req)

    req.data = { user: user.toWeb() }

    return next()
  },

  getPenalties: async (req, res, next) => {
    //user = await Service.updateMe(req)
    req.data = { user: user.penalties, message: 'penalties' }

    return next()
  },

}

