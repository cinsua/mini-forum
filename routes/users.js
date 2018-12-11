const controller = require('../controllers/users');
const passport      	= require('passport');
require('../middlewares/passport')(passport)
const UnauthorizedError = require('../tools/customErrors').UnauthorizedError

var express = require('express')
const userRouter = express.Router();

userRouter.route('/')
  .get(passport.authenticate('jwt', {session:false}),controller.getMe) //passport.authenticate('jwt', {session:false})
  .post(controller.createUser)
  .delete(passport.authenticate('jwt', {session:false}),controller.deleteMe)
  .put(passport.authenticate('jwt', {session:false}),controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;


//FOR YOUR INFORMATION -- ACTUALLY NOT USED
async function middlePassport(req,res,next) {
  //WORKS!
  //console.log('pre await');

  //WARNING passport.authenticate returns a function.. calling finally with (req, res, next)
  //CALLBACK CANT BE ASYNC. ERRORS DONT GET BUBLED UP
  //CAN BE ASYNC ONLY IF YOU MANUALLY PUT NEW ERROR ON NEXT()
  let authFunc = await passport.authenticate('jwt', async function(err, user, info) {
    //info gets an error if token is invalid
    //console.log('in await cb')
    //console.log(info.message)
    if (info){
      // no auth token / jwt expired / token invalid
      //throw new UnauthorizedError(info.message, 'AU01')
      return next(new UnauthorizedError(info.message, 'AU01'))
    }
    
    if (err) { 
      console.log('MY ERROR FROM TOKEN')
      return next(new UnauthorizedError(err.message, 'AU02'))}
    if (!user) { 
      console.log('MY ERROR FROM NOT USER')
      return next(new UnauthorizedError(err.message, 'AU03')) }
    
    req.user = user
    //console.log(req.user)
    return next()
    })//(req, res, next);
  
  await authFunc(req, res, next)

  //console.log('post await');
  //await auth(req, res, next)
  //BE CAREFUL authenticate dont seems to be async.. so escapes before get user
  //authenticate return a function!!
  //return await next()
}