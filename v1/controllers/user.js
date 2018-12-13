const Service = require('../services/user');
const UserError = require('../utils/customErrors').UserError
const RoleError = require('../utils/customErrors').RoleError
const roles = require('../models/roles')

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

  login: async (req, res, next) => {
    let user = await Service.getMe(req.body);
    if (!user) throw new UserError('Username/password invalid', 'USPW_INV');

    access = await user.comparePassword(req.body.password);
    if (!access) throw new UserError('Username/password invalid', 'USPW_INV');

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

  promoteUser: async (req, res, next) => {

    const {idToPromote, usernameToPromote, levelToPromote} = req.body

    if (!idToPromote && !usernameToPromote){
      throw new RoleError('You must provide idToPromote or usernameToPromote','IDUS_NF')
    }else if(idToPromote && usernameToPromote){
      throw new RoleError('You must provide ONLY ONE idToPromote or usernameToPromote','IDUS_BF')
    }

    if (!levelToPromote){
      throw new RoleError('You must provide a levelToPromote','LP_NF')
    }else if(!Object.keys(roles.levels).includes(levelToPromote)){
      throw new RoleError('You must provide a valid levelToPromote','LP_INV')
    }

    let idOrUsername = idToPromote || usernameToPromote
    userToPromote = await Service.get(idOrUsername)
    if (!userToPromote){
      throw new RoleError('User to Promote not found','USTP_NF')
    }

    let oldRole = userToPromote.role
    if (oldRole === levelToPromote){
      throw new RoleError(`${userToPromote.username} already is a ${levelToPromote}`,'US_NPN')
    }
    if (roles.levels[oldRole] > roles.levels[levelToPromote]){
      throw new RoleError(`[${oldRole}] to [${levelToPromote}] is not a Promotion`,'US_NP')
    }
    // Only superadmin can create admins. admins can create moderators
    if (roles.levels[levelToPromote] >= roles.levels [req.user.role]){
      throw new RoleError(`You have not enought privileges to promote from [${oldRole}] to [${levelToPromote}]`,'US_NEP')
    }
    userToPromote = await Service.update(userToPromote, {role: levelToPromote})

    req.data = { user: userToPromote.toWeb(), message: `Username ${userToPromote.username} promoted from [${oldRole}] to [${levelToPromote}]` }
    return next()
  },

  degradeUser:async (req, res, next) => {
    const {idToDegrade, usernameToDegrade, levelToDegrade} = req.body

    if (!idToDegrade && !usernameToDegrade){
      throw new RoleError('You must provide idToDegrade or usernameToDegrade','IDUS_NF')
    }else if(idToDegrade && usernameToDegrade){
      throw new RoleError('You must provide ONLY ONE idToDegrade or usernameToDegrade','IDUS_BF')
    }

    if (!levelToDegrade){
      throw new RoleError('You must provide a levelToDegrade','LP_NF')
    }else if(!Object.keys(roles.levels).includes(levelToDegrade)){
      throw new RoleError('You must provide a valid levelToDegrade','LP_INV')
    }

    let idOrUsername = idToDegrade || usernameToDegrade
    userToDegrade = await Service.get(idOrUsername)
    if (!userToDegrade){
      throw new RoleError('User to degrade not found','USTD_NF')
    }

    let oldRole = userToDegrade.role
    if (oldRole === levelToDegrade){
      throw new RoleError(`${userToDegrade.username} already is a ${levelToDegrade}`,'US_NPN')
    }
    if (roles.levels[oldRole] < roles.levels[levelToDegrade]){
      throw new RoleError(`[${oldRole}] to [${levelToDegrade}] is not a Degrade`,'US_ND')
    }
    // Only superadmin can degrade admins. admins can degrade moderators
    if (roles.levels[levelToDegrade] >= roles.levels [req.user.role]){
      throw new RoleError(`You have not enought privileges to degrade from [${oldRole}] to [${levelToDegrade}]`,'US_NEP')
    }
    userToDegrade = await Service.update(userToDegrade, {role: levelToDegrade})

    req.data = { user: userToDegrade.toWeb(), message: `Username ${userToDegrade.username} degraded from [${oldRole}] to [${levelToDegrade}]` }
    return next()
  },

  iAmAdmin: async (req, res, next) => {
    req.data = {message: `${req.user.username} you have acces to admin tools`}
    return next()

  }
  
}