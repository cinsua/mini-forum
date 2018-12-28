var express = require('express')
const userRouter = express.Router();

const controller = require('../controllers/user');
const {getCredentials} = require('../middlewares/getCredentials')
const {reqValidator } = require('../middlewares/request')

/*
TODO LIST
remove req dependecy of all services
create penalty controller?
create standar response, including hateoas
put a serious logger
*/

const passport = require('passport');
let passp = passport.authenticate(['bearer', 'guest'], { session: false })

/*#################################################################
#         All routes api/v1/users/*                               #
#################################################################*/

userRouter.use(passp)

userRouter.route('/')
  .get(getCredentials, reqValidator, controller.getAll)
  .post(getCredentials,reqValidator, controller.createUser)

//works users/:id users/username users/me
userRouter.route('/:id')
  .get(getCredentials, reqValidator, controller.getById)
  .delete(getCredentials,reqValidator,  controller.deleteMe)
  // patch should be redone
  .patch(getCredentials, controller.updateMe)

userRouter.route('/login')
  .post(getCredentials, reqValidator, controller.login)

userRouter.route('/:id/penalties')
  .get(getCredentials, reqValidator, controller.getPenalties)

userRouter.route('/:id/penalties/bans')
  .post(getCredentials, reqValidator, controller.banUser)
  .get(getCredentials, reqValidator, controller.getBans)

// TODO get
userRouter.route('/:id/penalties/bans/:banId')
  .delete(getCredentials, reqValidator, controller.removeBan)

userRouter.route('/:id/penalties/silences')
  .post(getCredentials, reqValidator, controller.silenceUser)
  .get(getCredentials, reqValidator, controller.getSilences)

// TODO get
userRouter.route('/:id/penalties/silences/:silenceId')
  .delete(getCredentials, reqValidator, controller.removeSilence)

// TODO get route
userRouter.route('/:id/roles')
  .post(getCredentials,reqValidator, controller.addRole)
  .delete(getCredentials,reqValidator, controller.removeRole)

module.exports = userRouter;