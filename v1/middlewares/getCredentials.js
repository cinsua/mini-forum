const { newError } = require('../utils/customErrors')
const roles = require('../models/roles')


module.exports = {

  async getCredentials(req, res, next) {

    // we will fill this with roles and read/write/update/delete permissions
    let credentials = {}
    credentials.roles = req.user.roles
    credentials.route = req.baseUrl + req.route.path
    credentials.originalUrl = req.originalUrl

    let routes = req.app.routes

    if (await checkOwner(req)) credentials.roles.push('owner')

    // based on route and method we pick the best role, or die trying
    let requiredRoles = routes[req.baseUrl + req.route.path][req.method].roleRequired

    let availableRoles = requiredRoles.filter(role => credentials.roles.includes(role))

    // check if an array is empty takes more than equals []
    if (!Array.isArray(availableRoles) || !availableRoles.length) {
      throw newError('AUTH_INSUFFICIENT_PRIVILEGES')
    }

    // we put values to available roles, taken from roles.levels
    const rolesLevel = availableRoles
      .reduce((obj, key) => ({ ...obj, [key]: roles.levels[key] }), {})

    // best role based on values taken from rolesLevel
    let bestRole = Object.keys(rolesLevel).reduce((a, b) => rolesLevel[a] > rolesLevel[b] ? a : b)
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

async function checkOwner(req) {

  const route = req.app.routes[req.baseUrl + req.route.path][req.method]
  let owner = false
  if (route.checkOwner) {
    if (await route.checkOwner(req) > 0) owner = true
  }
  return owner
}
