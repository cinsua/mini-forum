const controller = require('../controllers/users');
const passport      	= require('passport');
require('../middlewares/passport')(passport)
const UnauthorizedError = require('../tools/customErrors').UnauthorizedError

var express = require('express')
const userRouter = express.Router();

userRouter.route('/')
  .get(middlePassport,controller.getMe) //passport.authenticate('jwt', {session:false})
  .post(controller.createUser)
  .delete(passport.authenticate('jwt', {session:false}),controller.deleteMe)
  .put(passport.authenticate('jwt', {session:false}),controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;

async function middlePassport(req,res,next) {
  //WORKS!
  console.log('pre await');

  //WARNING passport.authenticate returns a function.. calling finally with (req, res, next)
  await passport.authenticate('jwt', async function(err, user, info) {
    //info gets an error if token is invalid
    console.log('in await cb')
    //console.log(info.message)
    if (info){
      throw new UnauthorizedError(info.message, 'AU01')
    }
    if (err) { 
      console.log('MY ERROR FROM TOKEN')
      return next(err); }
    if (!user) { 
      console.log('MY ERROR FROM NOT USER')
      return next(err); }
    req.user = user
    console.log(req.user)
    return next()
    })(req, res, next);
  
  console.log('post await');
  //BE CAREFUL authenticate dont seems to be async.. so escapes before get user
  //authenticate return a function!!
  //return next()
}