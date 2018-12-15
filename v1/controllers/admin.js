const Service = require('../services/user');
const AuthError = require('../utils/customErrors').AuthError
const RoleError = require('../utils/customErrors').RoleError
const AdminError = require('../utils/customErrors').AdminError
const roles = require('../models/roles')
const Ban = require('../models/bans');
const User = require('../models/user');
const helper = require('../utils/adminChequers')

module.exports = {

  promoteUser: async (req, res, next) => {
    const { id, username, newRole } = await helper.checkBodyForChangeRole(req.body)

    userToPromote = await Service.get(id || username)
    if (!userToPromote) {
      throw new RoleError('User to Promote not found', 'USTP_NF')
    }

    let oldRole = userToPromote.role
    if (oldRole === newRole) {
      throw new RoleError(`${userToPromote.username} already is a ${newRole}`, 'US_NPN')
    }
    if (roles.levels[oldRole] > roles.levels[newRole]) {
      throw new RoleError(`[${oldRole}] to [${newRole}] is not a Promotion`, 'US_NP')
    }
    // Only superadmin can create admins. admins can create moderators
    if (roles.levels[newRole] >= roles.levels[req.user.role]) {
      throw new RoleError(`You have not enought privileges to promote from [${oldRole}] to [${newRole}]`, 'US_NEP')
    }
    userToPromote = await Service.update(userToPromote, { role: newRole })

    req.data = { user: userToPromote.toWeb(), message: `Username ${userToPromote.username} promoted from [${oldRole}] to [${newRole}]` }

    return next()
  },

  degradeUser: async (req, res, next) => {
    const { id, username, newRole } = await helper.checkBodyForChangeRole(req.body)

    userToDegrade = await Service.get(id || username)
    if (!userToDegrade) {
      throw new RoleError('User to degrade not found', 'USTD_NF')
    }

    let oldRole = userToDegrade.role
    if (oldRole === newRole) {
      throw new RoleError(`${userToDegrade.username} already is a ${newRole}`, 'US_NPN')
    }
    if (roles.levels[oldRole] < roles.levels[newRole]) {
      throw new RoleError(`[${oldRole}] to [${newRole}] is not a Degrade`, 'US_ND')
    }
    // Only superadmin can degrade admins. admins can degrade moderators
    if (roles.levels[newRole] >= roles.levels[req.user.role]) {
      throw new RoleError(`You have not enought privileges to degrade from [${oldRole}] to [${newRole}]`, 'US_NEP')
    }

    userToDegrade = await Service.update(userToDegrade, { role: newRole })

    req.data = { user: userToDegrade.toWeb(), message: `Username ${userToDegrade.username} degraded from [${oldRole}] to [${newRole}]` }

    return next()
  },

  iAmAdmin: async (req, res, next) => {
    req.data = { message: `${req.user.username} you have acces to admin tools` }

    return next()
  },

  banUser: async (req, res, next) => {
    const { id, username, reason, timeBanned, expireBan } = await helper.checkBodyForBanUser(req.body)
    let ban = new Ban({ reason })
    ban.author = req.user
    if (timeBanned) ban.timeBanned = timeBanned
    if (expireBan) ban.expireDate = expireBan
    userToBan = await Service.get(id || username)

    userToBan.bans.push(ban)
    await userToBan.save()
 
    req.data = { message: `Banned Succesfully`, user: userToBan }
    
    return next()
  }

}
