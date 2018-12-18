const controller = require('../controllers/user');
const response = require('../middlewares/response')
const auth = require('../middlewares/requiredLevel')
//auth.requiredRole('guest')

const passport = require('passport');

var express = require('express')
const userRouter = express.Router();

let passportBearer = passport.authenticate('bearer', { session: false })
let passportBearerAndGuest = passport.authenticate(['bearer', 'guest'], { session: false })

userRouter.route('/')
  .get(passportBearerAndGuest, controller.getAll)
  .post(controller.createUser)

userRouter.route('/me')
  .get(passportBearer, controller.getMe)//, response.sendSuccess)
  .delete(passportBearer, controller.deleteMe)
  .patch(passportBearer, controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

  // Carefoul, /:id and /me matchs for both
userRouter.route('/:id') 
  .get(passportBearerAndGuest, controller.getById)
/*
  add penalties services
  we can split silences n ban or use descriptors
  add roles services
  CHANGE all to own collections (ref)
  populate when required
  add filters
  add soft delete
  dont show soft deleted, except when required
  implement better querys
  implement roles similar to penalties

  USER:
    bans: [ref]
    silences: [ref]
    or penalties: [ref] with descriptors
    roles: [ref]

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
userRouter.route('/:id/penalties') 
  .get(passportBearer,auth.requiredRole('moderator'), controller.getPenalties)

module.exports = userRouter;