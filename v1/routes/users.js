const controller = require('../controllers/users');
const passport = require('passport');

var express = require('express')
const userRouter = express.Router();

userRouter.route('/')
  .get(passport.authenticate('bearer', { session: false, failWithError: true }), controller.getMe) //passport.authenticate('jwt', {session:false})
  .post(controller.createUser)
  .delete(passport.authenticate('bearer', { session: false }), controller.deleteMe)
  .put(passport.authenticate('bearer', { session: false }), controller.updateMe)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;

/*
//FOR YOUR INFORMATION -- ACTUALLY NOT USED
async function middlePassport(req,res,next) {
  //WORKS!
  //console.log('pre await');

  //WARNING passport.authenticate returns a function.. calling finally with (req, res, next)
  //CALLBACK CANT BE ASYNC. ERRORS DONT GET BUBLED UP
  //CAN BE ASYNC ONLY IF YOU MANUALLY PUT NEW ERROR ON NEXT()
  let authFunc = await passport.authenticate('jwt', async function(err, user, info) {
    //info gets an error if token is invalid
    if (info){
      // no auth token / jwt expired / token invalid
      //throw new UnauthorizedError(info.message, 'AU01')
      return next(new UnauthorizedError(info.message, 'AU01'))
    }
    
    if (err) { 
      // ERROR FROM TOKEN
      return next(new UnauthorizedError(err.message, 'AU02'))}
    if (!user) { 
      // ERROR FROM NOT USER
      return next(new UnauthorizedError(err.message, 'AU03')) }
    
    req.user = user
    //console.log(req.user)
    return next()
    })//(req, res, next);
  
  await authFunc(req, res, next)

  //BE CAREFUL authenticate dont seems to be async.. so escapes before get user
  //authenticate return a function!!
  //return await next()
}*/