const userRouter = require('./users');
const express = require('express')

const success = require('../middlewares/response')

const apiV1 = express.Router();


apiV1.route('/')
  .get((req, res, next) => {
    //get commit version from file
    req.data={message: 'Server alive',version:'0.0.1',commit:'insert commit running'}
    next()
  })
  /*
  .post((req, res, next) => {
    res.status(200).send('hello from apiv1 post router');
  })
  */
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
  //console.log(err.message);
  //console.log(err.name);
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
  res.status(status).send(result);
}