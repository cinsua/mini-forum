


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

    return { id, username, newRole }
  },

  checkBodyForBanUser: async (body) => {
    const { id, username, reason, timeBanned, expireBan } = body

    if (!id && !username) {
      throw new AdminError('You must provide id or username', 'IDUS_NF')
    } else if (id && username) {
      throw new AdminError('You must provide ONLY ONE id or username', 'IDUS_BF')
    }

    if (!timeBanned && !expireBan) {
      throw new AdminError('You must provide timeBanned or expireBan', 'IDUS_NF')
    } else if (timeBanned && expireBan) {
      throw new AdminError('You must provide ONLY ONE timeBanned or expireBan', 'IDUS_BF')
    }

    if (!reason) {
      throw new AdminError('You must provide a reason', 'LP_NF')
    }
    
    return { id, username, reason, timeBanned, expireBan }
  }

}