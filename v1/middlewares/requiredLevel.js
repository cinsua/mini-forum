const RoleError = require('../utils/customErrors').RoleError
const AuthError = require('../utils/customErrors').AuthError
const roles = require('../models/roles')

module.exports = {

  requiredRole: (role) => {
    return function (req, res, next) {

      if (!Object.keys(roles.levels).includes(role)){
        return next(new RoleError("Role don't exist", "RO_NE"))
      }

      if (roles.levels[role] > roles.levels [req.user.role]){
        return next(new AuthError(`Not enough privileges. Required Level [${role}]`,'AUTH_LEVEL'))
      }

      return next()

    }
  }
}