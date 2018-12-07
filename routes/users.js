const controller = require('../controllers/users');
const passport      	= require('passport');
require('../middlewares/passport')(passport)

var express = require('express')
const userRouter = express.Router();

userRouter.route('/')
  .get(passport.authenticate('jwt', {session:false}),controller.getMe)
  .post(controller.createUser)

userRouter.route('/login')
  .post(controller.login)

module.exports = userRouter;



















/*
module.exports = (router) => {
  router.route('/users')
    .post(controller.add)
    .get(passport.authenticate('jwt', {session:false}),controller.getMe),
  //middleware to send
  router.use( async (req, res, next)=>{
    console.log('status ', req.status)
    let result = {
      data: req.data,
      error: req.error
    }
    res.status(req.status).send(result);
    console.log('pasamos por el ult midd')
  }),
  router.use(errorHandler)

  
}

//little errorhanler middleware
async function errorHandler(err,req, res,next){
  console.log(err.toString())
  let result = {
    data: req.data,
    error: req.error || err
  }
  res.status(500).send(result);
}

*/