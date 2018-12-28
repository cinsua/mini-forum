const { newError } = require('../utils/customErrors')
const roles = require('../models/roles')

module.exports = {

  getCredentials: async function (req, res, next) {

    // we will fill this with roles and read/write/update/delete permissions
    let credentials = {}
    credentials.roles = req.user.roles
    
    await checkOwner(req)

    // we add 'owner' to our roles in some cases
    if (req.owner) req.user.roles.push('owner') //old
    if (req.owner) credentials.roles.push('owner')

    // based on route and method we pick the best role, or die trying
    usrRoles = req.user.roles

    requiredRoles = roles.routes[req.baseUrl + req.route.path][req.method]

    let availableRoles = requiredRoles.filter(role => usrRoles.includes(role))

    // i have no fucking idea what kind of array need this check for empty
    if (!Array.isArray(availableRoles) || !availableRoles.length) {
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')
    }

    // we put values to available roles, taken from roles.levels
    const rolesLevel = availableRoles
      .reduce((obj, key) => ({ ...obj, [key]: roles.levels[key] }), {});

    // best role based on values taken from rolesLevel
    bestRole = Object.keys(rolesLevel).reduce((a, b) => rolesLevel[a] > rolesLevel[b] ? a : b)
    credentials.bestRole = bestRole

    credentials.readFields = {}
    credentials.readFields.user = roles.READ.user[bestRole]
    credentials.readFields.penalty = roles.READ.penalty[bestRole]

    // req.credentials is the new black
    req.credentials = credentials

    return next()

  }
}

async function checkOwner(req) {

  req.owner = false

  if (req.params.id === req.user.id ||
    req.params.id === req.user.username) {

    req.owner = true

  }
  // users/me -> users/req.user.id (already auth)
  if (req.params.id === 'me') {
    if (!arraysEqual(req.user.roles, ['guest'])) {
      req.params.id = req.user.id
      req.owner = true
    } else {
      throw newError('LOGIN_REQUIRED')
    }

  }
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
  }

  return true;
}