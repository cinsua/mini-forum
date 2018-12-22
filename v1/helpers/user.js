const AdminError = require('../utils/customErrors').AdminError
const RoleError = require('../utils/customErrors').RoleError
const roles = require('../models/roles')

// TODO checks id to be mongoose id

module.exports = {
  forCreateUser: (req) => {
    return { username, password } = req.body
  },
  checkRol: async (user, rol, remove=false) => {
    if (!rol) {
      throw new RoleError('You must provide a rol', 'LP_NF')
    } else if (!Object.keys(roles.levels).includes(rol)) {
      throw new RoleError('You must provide a valid rol', 'LP_INV')
    }
    if (user.roles.includes(rol) && !remove ) {
      throw new RoleError(`${user.username} already have [${rol}] rol`, 'LP_INV')
    }
    if (!user.roles.includes(rol) && remove ){
      throw new RoleError(`${user.username} dont have [${rol}] rol`, 'LP_INV')
    }
  },
}