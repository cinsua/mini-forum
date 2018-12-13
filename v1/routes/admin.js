const controller = require('../controllers/user');
const passport = require('passport');
const auth = require('../middlewares/requiredLevel')
var express = require('express')
const adminRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })

//everyone has to be admin to access
adminRouter.use(passportBearer, auth.requiredRole('admin'))

adminRouter.route('/')
  .get(controller.iAmAdmin)

//require body: idToPromote || usernameToPromote, levelToPromote 
adminRouter.route('/promoteuser')
  .post(controller.promoteUser)

  //require body: idToDegrade || usernameToDegrade, levelToDegrade 
adminRouter.route('/degradeUser')
  .post(controller.degradeUser)

module.exports = adminRouter;