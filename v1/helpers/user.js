const { newError } = require('../utils/customErrors')
const roles = require('../models/roles')

// TODO checks id to be mongoose id

module.exports = {

  checkRole: async (user, role, req, remove = false) => {

    // haha, nobody can have 'owner' role
    // keep for sanity, already filtered in Joi reqValidator
    if (role == 'owner')
      throw newError('ASSIGNMENT_ROLE_INVALID')

    if (user.roles.includes(role) && !remove)
      throw newError('ASSIGNMENT_ROLE_ALREADY_PRESENT')

    if (!user.roles.includes(role) && remove)
      throw newError('ASSIGNMENT_ROLE_NOT_PRESENT')

    // theres only one superadmin and nobody can create other
    if (roles.levels[role] >= roles.levels[req.credentials.bestRole])
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')
  },
}