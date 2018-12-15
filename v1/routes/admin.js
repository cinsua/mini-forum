const adminController = require('../controllers/admin');
const passport = require('passport');
const auth = require('../middlewares/requiredLevel')
var express = require('express')
const adminRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })

//everyone has to be admin to access
adminRouter.use(passportBearer, auth.requiredRole('admin'))

adminRouter.route('/')
  .get(adminController.iAmAdmin)

//require body: id || username, newRole 
adminRouter.route('/users.promote')
  .post(adminController.promoteUser)

// require body: id || username, newRole 
adminRouter.route('/users.degrade')
  .post(adminController.degradeUser)

// require body: id || username, reason, timePenalty || expirePenalty
adminRouter.route('/users.ban')
  .post(adminController.banUser)

// require body: id || username, reason, timePenalty || expirePenalty
adminRouter.route('/users.silence')
  .post(adminController.silenceUser)

module.exports = adminRouter;