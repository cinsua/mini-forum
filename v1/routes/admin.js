const userController = require('../controllers/user');
const adminCcontroller = require('../controllers/admin');
const passport = require('passport');
const auth = require('../middlewares/requiredLevel')
var express = require('express')
const adminRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })

//everyone has to be admin to access
adminRouter.use(passportBearer, auth.requiredRole('admin'))

adminRouter.route('/')
  .get(adminCcontroller.iAmAdmin)

//require body: id || username, newRole 
adminRouter.route('/users.promote')
  .post(adminCcontroller.promoteUser)

// require body: id || username, newRole 
adminRouter.route('/users.degrade')
  .post(adminCcontroller.degradeUser)

// require body: id 
adminRouter.route('/users.ban')
  .post(adminCcontroller.banUser)

module.exports = adminRouter;