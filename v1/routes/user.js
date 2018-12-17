const controller = require('../controllers/user');
const response = require('../middlewares/response')

const passport = require('passport');

var express = require('express')
const userRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })

userRouter.route('/')
  .get(controller.getAll)
  .post(controller.createUser)

userRouter.route('/me')
  .get(passportBearer, controller.getMe)//, response.sendSuccess)
  .delete(passportBearer, controller.deleteMe)
  .patch(passportBearer, controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

  // Carefoul, /:id and /me matchs for both
userRouter.route('/:id') 
  .get(passportBearer, controller.getById)

userRouter.route('/:id/penalties') 
  .get(passportBearer, controller.getPenalties)

module.exports = userRouter;