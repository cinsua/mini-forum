const controller = require('../controllers/user');
const response = require('../middlewares/response')
const auth = require('../middlewares/requiredLevel')
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

userRouter.route('/me')
  .get(auth.role, controller.getMe)//, response.sendSuccess)
  .delete(auth.role, controller.deleteMe)
  .patch(auth.role, controller.updateMe)

userRouter.route('/login')
  .post(auth.role, controller.login)

// Carefoul, /:id and /me matchs for both
userRouter.route('/:id')
  .get(auth.role, controller.getById)

userRouter.route('/:id/penalties/bans')
  .post(auth.role, controller.banUser)

userRouter.route('/:id/penalties')
  .get(auth.role, controller.getPenalties)
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