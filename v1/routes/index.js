const userRouter = require('./user');
const adminRouter = require('./admin');
const express = require('express')
var server = require('../../tools/serverTools')
const response = require('../middlewares/response')
const auth = require('../middlewares/requiredLevel')
const CONFIG = require('../../config/config')

const passport = require('passport');

// Setup Passport Strategies for api/v1
require('../strategies/guest')();
require('../strategies/jwt')();


const apiV1 = express.Router();


apiV1.route('/')
  .get(passport.authenticate(['bearer', 'guest'], { session: false }),auth.requiredRole('guest'), (req, res, next) => {
    req.data = { message: 'Server running', user: user.username, version: CONFIG.VERSION, commit: CONFIG.COMMIT }
    req.readyToSend = true
    next()

  })

//---------------------------------------------------------------
// routes form controllers
apiV1.use('/users', userRouter);
apiV1.use('/admin', adminRouter)


//---------------------------------------------------------------
//Middlewares to all api v1

//Standar response middleware for every success scenario
apiV1.use(response.sendSuccess);

//Standar response middleware for every Error scenario
apiV1.use(response.sendError);


module.exports = apiV1;