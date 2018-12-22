const controller = require('../controllers/user');
const response = require('../middlewares/response')
const auth = require('../middlewares/requiredLevel')
const check = require('../middlewares/checkOwner')
//auth.requiredRole('guest')

const passport = require('passport');

var express = require('express')
const userRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })
let passp = passport.authenticate(['bearer', 'guest'], { session: false })

userRouter.use(passp)
//userRouter.use(auth.role)

userRouter.route('/')
  .get(auth.role, controller.getAll)
  .post(auth.role, controller.createUser)

// Carefoul, /:id and /me and /login matchs in same method
//works users/:id users/username users/me
userRouter.route('/:id')
  .get(check.Owner, auth.role, controller.getById)
  .delete(check.Owner, auth.role, controller.deleteMe)
  // patch should be redone
  .patch(check.Owner,auth.role, controller.updateMe)

userRouter.route('/login')
  .post(auth.role, controller.login)

userRouter.route('/:id/penalties')
  .get(check.Owner, auth.role, controller.getPenalties)

userRouter.route('/:id/penalties/bans')
  .post(auth.role, controller.banUser)
  .get(check.Owner, auth.role, controller.getBans)

userRouter.route('/:id/penalties/bans/:banId')
  .delete(check.Owner, auth.role, controller.removeBan)

userRouter.route('/:id/penalties/silences')
  .post(auth.role, controller.silenceUser)
  .get(check.Owner, auth.role, controller.getSilences)

userRouter.route('/:id/penalties/silences/:silenceId')
  .delete(check.Owner, auth.role, controller.removeSilence)

// TODO add get route
userRouter.route('/:id/roles')
  //.get(check.Owner, auth.role, controller.getPenalties)
  .post(check.Owner, auth.role, controller.addRol)
  .delete(check.Owner, auth.role, controller.removeRol)

/*
  add penalties services [incomplete]
  add roles services [not necesary, middleware requiredLevel implemented]
  CHANGE all to own collections (ref) [ban/silence implemented]
  populate when required [incomplete]
  add filters
  add soft delete [incomplete]
  dont show soft deleted, except when required
  implement better querys [incomplete]
  implement roles similar to penalties [implemented in models/roles]

  USER:
    penalties: [ref]

// we can populate later on the query:
var user = { name: 'Indiana Jones', weapon: 389 }
Weapon.populate(user, { path: 'weapon', model: 'Weapon' }, function (err, user) {
  console.log(user.weapon.name) // whip
})

  :id/penalties
    get
  :id/penalties/bans
    get
    post
    patch
    delete
  :id/penalties/silences
    get, post, patch, delete
  :id/roles
    get, post, delete
*/


module.exports = userRouter;