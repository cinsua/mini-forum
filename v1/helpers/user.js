const AdminError = require('../utils/customErrors').AdminError
const RoleError = require('../utils/customErrors').RoleError
const roles = require('../models/roles')

// TODO checks id to be mongoose id

module.exports = {
  checkBodyForChangeRole: async (body) => {
    const { id, username, newRole } = body

    if (!id && !username) {
      throw new RoleError('You must provide id or username', 'IDUS_NF')
    } else if (id && username) {
      throw new RoleError('You must provide ONLY ONE id or username', 'IDUS_BF')
    }

    if (!newRole) {
      throw new RoleError('You must provide a newRole', 'LP_NF')
    } else if (!Object.keys(roles.levels).includes(newRole)) {
      throw new RoleError('You must provide a valid newRole', 'LP_INV')
    }
    // i dont need it, just in case
    return { id, username, newRole }
  },

  checkBodyForPenaltyUser: async (body) => {
    const { id, username, reason, timePenalty, expirePenalty } = body

    if (!id && !username) {
      throw new AdminError('You must provide id or username', 'IDUS_NF')
    } else if (id && username) {
      throw new AdminError('You must provide ONLY ONE id or username', 'IDUS_BF')
    }

    if (!timePenalty && !expirePenalty) {
      throw new AdminError('You must provide timePenalty or expirePenalty', 'IDUS_NF')
    } else if (timePenalty && expirePenalty) {
      throw new AdminError('You must provide ONLY ONE timePenalty or expirePenalty', 'IDUS_BF')
    }

    if (!reason) {
      throw new AdminError('You must provide a reason', 'LP_NF')
    }

    // i dont need it, just in case
    return { id, username, reason, timePenalty, expirePenalty }
  }

}