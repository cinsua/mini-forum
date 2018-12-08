const controller = require('../controllers/users');
const passport      	= require('passport');
require('../middlewares/passport')(passport)

var express = require('express')
const userRouter = express.Router();

userRouter.route('/')
  .get(passport.authenticate('jwt', {session:false}),controller.getMe)
  .post(controller.createUser)
  .delete(passport.authenticate('jwt', {session:false}),controller.deleteMe)
  .put(passport.authenticate('jwt', {session:false}),controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;