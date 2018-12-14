const controller = require('../controllers/user');
const passport = require('passport');

var express = require('express')
const userRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })

userRouter.route('/')
  .get(controller.getAll)
  .post(controller.createUser)

userRouter.route('/me')
  .get(passportBearer, controller.getMe)
  .delete(passportBearer, controller.deleteMe)
  .patch(passportBearer, controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;