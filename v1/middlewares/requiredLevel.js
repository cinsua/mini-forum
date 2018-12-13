const RoleError = require('../utils/customErrors').RoleError
const AuthError = require('../utils/customErrors').AuthError

module.exports = {

  requiredRole: (role) => {
    return function (req, res, next) {
      let roleValues = {
        guest: 0,
        user: 1,
        moderator: 2,
        admin: 3
      }
      if (!Object.keys(roleValues).includes(role)){
        return next(new RoleError("Role don't exist", "RO_NE"))
      }

      if (roleValues[role] > roleValues [req.user.role]){
        return next(new AuthError(`Not enough privileges. Required Level [${role}]`,'AUTH_LEVEL'))
      }

      return next()

    }
  }
}