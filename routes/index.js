const userRouter = require('./users');
const express = require('express')
var server = require('../tools/serverTools')
const success = require('../middlewares/response')
const CONFIG = require('../config/config')

const apiV1 = express.Router();


apiV1.route('/')
  .get((req, res, next) => {
    req.data={message: 'Server alive',version:CONFIG.VERSION,commit:CONFIG.COMMIT}
    next()
  })

//---------------------------------------------------------------
// routes form controllers
apiV1.use('/users', userRouter);


//---------------------------------------------------------------
//Middlewares to all api v1

//Standar response middleware for every success scenario
apiV1.use(success.sendResponse);

//Error Handlers
apiV1.use(errorHandler);


module.exports = apiV1;

//for now, here
/*
Mongoose intercepts every error in validation, drop him, and keep the message.
Therefore generate another ValidationError and boilerplate the message inside other
comments.

Then what we do to keep our code/msg/name is put them in a json inside the message.
when error is caught in middleware for handler errors, the message is depured y restored
from CUT_TAG
*/

async function errorHandler(err, req ,res, next){

  let errors = []

  if (err.message.includes('CUT_TAG')){
    // mongoose package all the validation errors, so we can have
    //more than 1 error
    let listOfErrors = err.message.split('"CUT_TAG"')
    //ignore the first, not contain a json
    for(i=1; i < listOfErrors.length; i++){
      let eWithJunk = listOfErrors[i]
      //slice the residual characters outside json
      let e = eWithJunk.slice(eWithJunk.indexOf('{'), eWithJunk.lastIndexOf('}'))
      e = JSON.parse(e)
      //for now, we will not keep stack from mongoose errors
      //e.stack = err.stack
      errors.push(e)
    }
  }else{
    errors.push(err)
  }

  let result = {
    success: false,
    data: req.data,
    errors
  }

  if (!req.status) req.status = 500

  if (process.env.NODE_ENV === 'development'){
    server.showReq(req, err)
  }
  if (CONFIG.TRACE_ERRORS_CONSOLE){
    server.showTrace(errors, err)
  }

  res.status(req.status)
  res.send(result);
}