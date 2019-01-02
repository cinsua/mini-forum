/*#################################################################
#         Generate routes defined in app.routes (routes/*)        #
#################################################################*/

require('../strategies/guest')();
require('../strategies/jwt')();
module.exports = {
  setupRoutes: function(app){
    //starts middlewares
    for (middle of app.routes['startMiddlewares'])
      app.use(middle)
    
    // register every route
    for (route of Object.keys(app.routes)){
      if (route !== 'startMiddlewares' && route !== 'finishMiddlewares'){
        for (method of Object.keys(app.routes[route])){
          app.route(route)[method.toLowerCase()](app.routes[route][method].middlewares)
        }
      }
    }
    
    // finish middlewares
    for (middle of app.routes['finishMiddlewares'])
      app.use(middle)
  }
}

// old way
/*
const express = require('express')
const CONFIG = require('../../config/config')

const passport = require('passport');

const userRouter = require('./user');
const response = require('../middlewares/response')

const { reqValidator } = require('../middlewares/request')
const { routes } = require('../routes/registeredRoutes')




// Setup Passport Strategies for api/v1
require('../strategies/guest')();
require('../strategies/jwt')();

const apiV1 = express.Router();

*/

/*#################################################################
#         Im Alive Checker                                        #
#################################################################*/
/*
apiV1.route('/')
  ['get'](passport.authenticate(['bearer', 'guest'], { session: false }), reqValidator, (req, res, next) => {
    req.data = { message: 'Server running', user: user.username, version: CONFIG.VERSION, commit: CONFIG.COMMIT }
    next()

  })
*/
/*
for (method of Object.keys(routes['/api/v1/'])){
  //for (mw of routes['/api/v1/'][method].middlewares){
  //  console.log(mw)
    apiV1.route('/')[method.toLowerCase()](routes['/api/v1/'][method].middlewares)
  //}
}
*/
/*#################################################################
#         Router Handlers                                         #
#################################################################*/
//apiV1.use('/users', userRouter);

/*#################################################################
#         Response Handlers                                       #
#################################################################*/

//Standar response middleware for every success scenario
///apiV1.use(response.sendSuccess);

//Standar response middleware for every Error scenario
//apiV1.use(response.sendError);

//module.exports = apiV1;