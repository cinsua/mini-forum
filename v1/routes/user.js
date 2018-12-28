var express = require('express')
const userRouter = express.Router();

const UserController = require('../controllers/user');
const PenaltyController = require('../controllers/penalty');
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
  .get(getCredentials, reqValidator, UserController.getAll)
  .post(getCredentials,reqValidator, UserController.createUser)

//works users/:id users/username users/me
userRouter.route('/:id')
  .get(getCredentials, reqValidator, UserController.getById)
  .delete(getCredentials,reqValidator,  UserController.deleteMe)
  // patch should be redone
  .patch(getCredentials, UserController.updateMe)

userRouter.route('/login')
  .post(getCredentials, reqValidator, UserController.login)

userRouter.route('/:id/penalties')
  .get(getCredentials, reqValidator, PenaltyController.getPenalties)

userRouter.route('/:id/penalties/bans')
  .post(getCredentials, reqValidator, PenaltyController.banUser)
  .get(getCredentials, reqValidator, PenaltyController.getBans)

// TODO get
userRouter.route('/:id/penalties/bans/:banId')
  .delete(getCredentials, reqValidator, PenaltyController.removeBan)

userRouter.route('/:id/penalties/silences')
  .post(getCredentials, reqValidator, PenaltyController.silenceUser)
  .get(getCredentials, reqValidator, PenaltyController.getSilences)

// TODO get
userRouter.route('/:id/penalties/silences/:silenceId')
  .delete(getCredentials, reqValidator, PenaltyController.removeSilence)

// TODO get route
userRouter.route('/:id/roles')
  .post(getCredentials,reqValidator, UserController.addRole)
  .delete(getCredentials,reqValidator, UserController.removeRole)

module.exports = userRouter;