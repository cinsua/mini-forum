const serviceUser = require('../services/user');
const servicePenalty = require('../services/penalty');
const AuthError = require('../utils/customErrors').AuthError
const RoleError = require('../utils/customErrors').RoleError
const AdminError = require('../utils/customErrors').AdminError
const roles = require('../models/roles')
const Penalty = require('../models/penalties');
const helper = require('../utils/adminChequers')

module.exports = {

  promoteUser: async (req, res, next) => {
    await helper.checkBodyForChangeRole(req.body)
    newRole = req.body.newRole

    userToPromote = await serviceUser.get(req)
    if (!userToPromote) throw new RoleError('User to Promote not found', 'USTP_NF')

    let oldRole = userToPromote.role

    if (oldRole === newRole) throw new RoleError(`${userToPromote.username} already is a ${newRole}`, 'US_NPN')
    if (roles.levels[oldRole] > roles.levels[newRole]) throw new RoleError(`[${oldRole}] to [${newRole}] is not a Promotion`, 'US_NP')

    // Only superadmin can create admins. admins can create moderators
    if (roles.levels[newRole] >= roles.levels[req.user.role]) {
      throw new RoleError(`You have not enought privileges to promote from [${oldRole}] to [${newRole}]`, 'US_NEP')
    }
    userToPromote = await serviceUser.update(userToPromote, { role: newRole })

    req.data = { user: userToPromote.toWeb(), message: `Username ${userToPromote.username} promoted from [${oldRole}] to [${newRole}]` }

    return next()
  },

  degradeUser: async (req, res, next) => {
    await helper.checkBodyForChangeRole(req.body)
    newRole = req.body.newRole

    userToDegrade = await serviceUser.get(req)
    if (!userToDegrade) throw new RoleError('User to degrade not found', 'USTD_NF')

    let oldRole = userToDegrade.role
    if (oldRole === newRole) throw new RoleError(`${userToDegrade.username} already is a ${newRole}`, 'US_NPN')
    if (roles.levels[oldRole] < roles.levels[newRole]) throw new RoleError(`[${oldRole}] to [${newRole}] is not a Degrade`, 'US_ND')
    
    // Only superadmin can degrade admins. admins can degrade moderators
    if (roles.levels[newRole] >= roles.levels[req.user.role]) {
      throw new RoleError(`You have not enought privileges to degrade from [${oldRole}] to [${newRole}]`, 'US_NEP')
    }

    userToDegrade = await serviceUser.update(userToDegrade, { role: newRole })

    req.data = { user: userToDegrade.toWeb(), message: `Username ${userToDegrade.username} degraded from [${oldRole}] to [${newRole}]` }

    return next()
  },

  iAmAdmin: async (req, res, next) => {
    req.data = { message: `${req.user.username} you have acces to admin tools` }

    return next()
  },

  banUser: async (req, res, next) => {

    await helper.checkBodyForPenaltyUser(req.body)

    ban = await servicePenalty.create(req, 'ban')
    userToBan = await serviceUser.get(req)
    if (!userToBan) throw new AdminError(`User to penalty not found`, 'USP_NF')

    await serviceUser.addPenalty(userToBan, ban)

    req.data = { message: `Banned Succesfully`, user: userToBan }

    return next()
  },

  silenceUser: async (req, res, next) => {
    await helper.checkBodyForPenaltyUser(req.body)
    
    silence = await servicePenalty.create(req, 'silence')
    userToSilence = await serviceUser.get(req)
    if (!userToSilence) throw new AdminError(`User to penalty not found`, 'USP_NF')

    await serviceUser.addPenalty(userToSilence, silence)
 
    req.data = { message: `Silenced Succesfully`, user: userToSilence }

    return next()
  }

}
