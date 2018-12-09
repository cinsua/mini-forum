const userRouter = require('./users');
const express = require('express')
var server = require('../tools/serverTools')
const success = require('../middlewares/response')
const CONFIG = require('../config/config')

const apiV1 = express.Router();


apiV1.route('/')
  .get((req, res, next) => {
    //get commit version from file
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

async function errorHandler(err, req ,res, next){

  let errors = []
  //finalError["name"] = err.name; 
  //finalError["message"] = err.message; 
  //finalError["code"] = err.code; 

  if (err.message.includes('CUT_TAG')){

    let listOfErrors = err.message.split('"CUT_TAG"')
    for(i=1; i < listOfErrors.length; i++){
      let eWithJunk = listOfErrors[i]
      let e = eWithJunk.slice(eWithJunk.indexOf('{'), eWithJunk.lastIndexOf('}'))
      e = JSON.parse(e)
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
  //let status = req.status || 500

  if (process.env.NODE_ENV === 'development'){
    server.showReq(req, err)
  }
  if (CONFIG.TRACE_ERRORS_CONSOLE){
    server.showTrace(errors, err)
  }

  res.status(req.status)
  res.send(result);
}