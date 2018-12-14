const Service = require('../services/user');
const AuthError = require('../utils/customErrors').AuthError
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

  getAll:async(req, res, next) => {
    // TODO
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

  promoteUser: async (req, res, next) => {

    const {id, username, newRole} = await checkBodyForChangeRole(req.body)

    userToPromote = await Service.get(id || username)
    if (!userToPromote){
      throw new RoleError('User to Promote not found','USTP_NF')
    }

    let oldRole = userToPromote.role
    if (oldRole === newRole){
      throw new RoleError(`${userToPromote.username} already is a ${newRole}`,'US_NPN')
    }
    if (roles.levels[oldRole] > roles.levels[newRole]){
      throw new RoleError(`[${oldRole}] to [${newRole}] is not a Promotion`,'US_NP')
    }
    // Only superadmin can create admins. admins can create moderators
    if (roles.levels[newRole] >= roles.levels [req.user.role]){
      throw new RoleError(`You have not enought privileges to promote from [${oldRole}] to [${newRole}]`,'US_NEP')
    }
    userToPromote = await Service.update(userToPromote, {role: newRole})

    req.data = { user: userToPromote.toWeb(), message: `Username ${userToPromote.username} promoted from [${oldRole}] to [${newRole}]` }
    return next()
  },

  degradeUser:async (req, res, next) => {
    
    const {id, username, newRole} = await checkBodyForChangeRole(req.body)

    userToDegrade = await Service.get(id || username)
    if (!userToDegrade){
      throw new RoleError('User to degrade not found','USTD_NF')
    }

    let oldRole = userToDegrade.role
    if (oldRole === newRole){
      throw new RoleError(`${userToDegrade.username} already is a ${newRole}`,'US_NPN')
    }
    if (roles.levels[oldRole] < roles.levels[newRole]){
      throw new RoleError(`[${oldRole}] to [${newRole}] is not a Degrade`,'US_ND')
    }
    // Only superadmin can degrade admins. admins can degrade moderators
    if (roles.levels[newRole] >= roles.levels [req.user.role]){
      throw new RoleError(`You have not enought privileges to degrade from [${oldRole}] to [${newRole}]`,'US_NEP')
    }
    userToDegrade = await Service.update(userToDegrade, {role: newRole})

    req.data = { user: userToDegrade.toWeb(), message: `Username ${userToDegrade.username} degraded from [${oldRole}] to [${newRole}]` }
    return next()
  },

  iAmAdmin: async (req, res, next) => {
    req.data = {message: `${req.user.username} you have acces to admin tools`}
    return next()

  }
  
}

async function checkBodyForChangeRole(body) {
  const {id, username, newRole} = body

  if (!id && !username){
    throw new RoleError('You must provide id or username','IDUS_NF')
  }else if(id && username){
    throw new RoleError('You must provide ONLY ONE id or username','IDUS_BF')
  }

  if (!newRole){
    throw new RoleError('You must provide a newRole','LP_NF')
  }else if(!Object.keys(roles.levels).includes(newRole)){
    throw new RoleError('You must provide a valid newRole','LP_INV')
  }
  return {id, username, newRole}
}