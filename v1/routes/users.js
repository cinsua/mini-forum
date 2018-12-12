const controller = require('../controllers/users');
const passport = require('passport');

var express = require('express')
const userRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })

userRouter.route('/')
  .get(passportBearer, controller.getMe)
  .post(controller.createUser)
  .delete(passportBearer, controller.deleteMe)
  .put(passportBearer, controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;