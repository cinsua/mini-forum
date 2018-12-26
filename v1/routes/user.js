var express = require('express')
const userRouter = express.Router();

const controller = require('../controllers/user');
const auth = require('../middlewares/requiredLevel')
const check = require('../middlewares/checkOwner')

const passport = require('passport');
let passp = passport.authenticate(['bearer', 'guest'], { session: false })

userRouter.use(passp)

userRouter.route('/')
  .get(auth.role, controller.getAll)
  .post(auth.role, controller.createUser)

// Carefoul, /:id and /me and /login matchs in same method
//works users/:id users/username users/me
userRouter.route('/:id')
  .get(check.Owner, auth.role, controller.getById)
  .delete(check.Owner, auth.role, controller.deleteMe)
  // patch should be redone
  .patch(check.Owner, auth.role, controller.updateMe)

userRouter.route('/login')
  .post(auth.role, controller.login)

userRouter.route('/:id/penalties')
  .get(check.Owner, auth.role, controller.getPenalties)

userRouter.route('/:id/penalties/bans')
  .post(auth.role, controller.banUser)
  .get(check.Owner, auth.role, controller.getBans)

  // TODO get
userRouter.route('/:id/penalties/bans/:banId')
  .delete(check.Owner, auth.role, controller.removeBan)

userRouter.route('/:id/penalties/silences')
  .post(auth.role, controller.silenceUser)
  .get(check.Owner, auth.role, controller.getSilences)

  // TODO get
userRouter.route('/:id/penalties/silences/:silenceId')
  .delete(check.Owner, auth.role, controller.removeSilence)

// TODO get route
userRouter.route('/:id/roles')
  //.get(check.Owner, auth.role, controller.getPenalties)
  // REQUIRES BODY.ROLE
  .post(check.Owner, auth.role, controller.addRole)
  .delete(check.Owner, auth.role, controller.removeRole)

module.exports = userRouter;