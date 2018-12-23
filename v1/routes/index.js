const express = require('express')
const CONFIG = require('../../config/config')

const passport = require('passport');

const userRouter = require('./user');
const response = require('../middlewares/response')

// Setup Passport Strategies for api/v1
require('../strategies/guest')();
require('../strategies/jwt')();

const apiV1 = express.Router();

//---------------------------------------------------------------
//        IM ALIVE CHECKER
//---------------------------------------------------------------
apiV1.route('/')
  .get(passport.authenticate(['bearer', 'guest'], { session: false }), (req, res, next) => {
    //throw newError('TEST_CODE')
    req.data = { message: 'Server running', user: user.username, version: CONFIG.VERSION, commit: CONFIG.COMMIT }
    next()

  })

//---------------------------------------------------------------
//        ROUTER HANDLERS
//---------------------------------------------------------------
apiV1.use('/users', userRouter);

//---------------------------------------------------------------
//        RESPONSE HANDLERS
//---------------------------------------------------------------

//Standar response middleware for every success scenario
apiV1.use(response.sendSuccess);

//Standar response middleware for every Error scenario
apiV1.use(response.sendError);

module.exports = apiV1;