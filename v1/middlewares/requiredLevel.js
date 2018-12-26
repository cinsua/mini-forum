const { newError } = require('../utils/customErrors')
const roles = require('../models/roles')

module.exports = {

  role: async function (req, res, next) {

    // we add 'owner' to our roles in some cases
    if (req.owner) req.user.roles.push('owner')

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

    // req.permissions will collect all benefits granted by the best role
    req.permissions = {}
    req.permissions.role = bestRole

    // Based on method and route we set permission method

    // we skip if not option defined for method/route
    if (!(req.method in roles)) return next()
    if (!((req.baseUrl + req.route.path) in roles[req.method])) return next()

    // todo next to deprecate
    allOptions = roles[req.method][req.baseUrl + req.route.path]
    bestRole in allOptions ?
      opt = bestRole :
      opt = 'default'
    req.permissions.options = allOptions[opt]

    req.permissions.readFields = {}

    req.permissions.readFields.user = roles.READ.user[bestRole]
    req.permissions.readFields.penalty = roles.READ.penalty[bestRole]

    return next()

  }
}