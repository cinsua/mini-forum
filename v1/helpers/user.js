const { newError } = require('../utils/customErrors')
const roles = require('../models/roles')

// TODO checks id to be mongoose id

module.exports = {
  /*
  forCreateUser: (req) => {
    let { username, password } = req.body
    if (!(username && password)) throw newError('USER_CREATION_PW_UNAME_REQUIRED')
    return { username, password }
  },
  forLoginUser: (req) => {
    let { username, password } = req.body
    if (!(username && password)) throw newError('LOGIN_PW_UNAME_REQUIRED')
    return { username, password }
  },*/
  checkRole: async (user, role, req, remove = false) => {

    if (!role)
      throw newError('ASSIGNMENT_ROLE_INVALID')

    // haha, nobody can have 'owner' role
    if (role == 'owner')
      throw newError('ASSIGNMENT_ROLE_INVALID')

    if (!Object.keys(roles.levels).includes(role))
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