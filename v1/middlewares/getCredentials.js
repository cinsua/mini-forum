const { newError } = require('../utils/customErrors')
const roles = require('../models/roles')
const { routes } = require('../routes/registeredRoutes')

module.exports = {

  getCredentials: async function (req, res, next) {

    // we will fill this with roles and read/write/update/delete permissions
    let credentials = {}
    credentials.roles = req.user.roles
    credentials.route = req.baseUrl + req.route.path
    credentials.originalUrl = req.originalUrl

    if (checkOwner(req)) credentials.roles.push('owner')

    // based on route and method we pick the best role, or die trying
    requiredRoles = routes[req.baseUrl + req.route.path][req.method].roleRequired

    let availableRoles = requiredRoles.filter(role => credentials.roles.includes(role))

    // check if an array is empty takes more than equals []
    if (!Array.isArray(availableRoles) || !availableRoles.length) {
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')
    }

    // we put values to available roles, taken from roles.levels
    const rolesLevel = availableRoles
      .reduce((obj, key) => ({ ...obj, [key]: roles.levels[key] }), {});

    // best role based on values taken from rolesLevel
    bestRole = Object.keys(rolesLevel).reduce((a, b) => rolesLevel[a] > rolesLevel[b] ? a : b)
    credentials.bestRole = bestRole

    // fill up readFields based on bestRole
    credentials.readFields = {}
    credentials.readFields.user = roles.READ.user[bestRole]
    credentials.readFields.penalty = roles.READ.penalty[bestRole]

    // req.credentials is the new black
    req.credentials = credentials

    return next()

  }
}

function checkOwner(req) {

  // only works for api/v1/users/* routes
  // add rules to cover threads and comments scenarios
  // something like check route includes '/:id/'
  // in threads case, we should look after retrieving the thread, so, maybe this cant handle it

  owner = false

  if (req.params.id === req.user.id ||
    req.params.id === req.user.username) {
    owner = true
  }

  // users/me -> users/req.user.id (already auth)
  if (req.params.id === 'me') {
    if (!arraysEqual(req.user.roles, ['guest'])) {
      req.params.id = req.user.id
      owner = true
    } else {
      throw newError('LOGIN_REQUIRED')
    }

  }
  return owner
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