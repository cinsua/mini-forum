const userRouter = require('./users');
const express = require('express')
var server = require('../tools/serverTools')
const success = require('../middlewares/response')

const apiV1 = express.Router();


apiV1.route('/')
  .get((req, res, next) => {
    //get commit version from file
    req.data={message: 'Server alive',version:'0.0.1',commit:'insert commit running'}
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
  
  let erro = {}
  erro["name"] = err.name; 
  erro["message"] = err.message; 
  erro["code"] = err.code; 

  let result = {
    success: false,
    data: req.data,
    error: erro
  }

  let status = req.status || 500

  if (process.env.NODE_ENV === 'development'){
    console.log(`${server.tagRed} [${req.originalUrl}] [${req.method}] [STATUS: ${status}] [${err.name}] [${err.code}]`)
  }

  res.status(status).send(result);
}