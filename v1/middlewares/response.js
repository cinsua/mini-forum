//default response to all success scenarios AND all errors
var server = require('../../tools/serverTools')
const CONFIG = require('../../config/config')

module.exports = {
  sendSuccess: async function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    // This handle all request in API/V1/* that not received treatment, can be in another middleware
    if (!req.data && !req.status) {
      req.status = 404
      server.showReq(req)
      res.status(req.status)
      res.send('Not Found in API/v1')
      return next();
    }

    let response = {
      data: req.data,
      success: true
    }

    if (!req.status) req.status = 200
    //let status = req.status || 200
    if (process.env.NODE_ENV === 'development') {
      server.showReq(req)
    }
    res.status(req.status)
    res.send(response);
    return next();
  },

  /*
  // MONGOOSE ERRORS DEPRECATED after the implement of JOI request validation
  // keep for sanity for now
  Mongoose intercepts every error in validation, drop him, and keep the message.
  Therefore generate another ValidationError and boilerplate the message inside other
  comments.

  Then what we do to keep our code/msg/name is put them in a json inside the message.
  when error is caught in middleware for handler errors, the message is depured y restored
  from CUT_TAG. its ugly, but i want my own codes of errors
  */
  sendError: async function (err, req, res, next) {

    //res.setHeader('Content-Type', 'application/json');
    let errors = []

    // MONGOOSE VALIDATION ERRORS HANDLER -- deprecated
    if (err.message.includes('CUT_TAG')) {
      // mongoose package all the validation errors, so we can have
      // more than 1 error
      let listOfErrors = err.message.split('"CUT_TAG"')
      // ignore the first, dont has a json
      for (i = 1; i < listOfErrors.length; i++) {
        let eWithJunk = listOfErrors[i]
        // slice the residual characters outside json. Ex: ': { json }, '
        let e = eWithJunk.slice(eWithJunk.indexOf('{'), eWithJunk.lastIndexOf('}'))
        e = JSON.parse(e)
        // for now, we will not keep stack for mongoose errors
        // e.stack = err.stack
        errors.push(e);
      }

    } else if (err.getError) {
      // if it is a custom error has getError() defined
      errors.push(err.getError())

    } else if (err.isJoi) {
      // is a request Joi validation
      errors = err.details.map((detail) => ({ code: 'REQUEST_VALIDATION', name: err.name, message: detail.message }))

    } else {
      // if this error is a generic one, we generate the error obj. Remember: message is a property
      // we should intercept mongo errors (11000 for example), it gives dbname/model/field
      errors.push({ name: err.name, message: err.message, code: err.code })
    }

    let response = {
      success: false,
      data: req.data,
      errors
    }

    // TODO use standar status codes
    if (!req.status) req.status = 500

    if (process.env.NODE_ENV === 'development') {
      server.showReq(req, err)
    }

    if (CONFIG.TRACE_ERRORS_CONSOLE) {
      server.showTrace(errors, err)
    }

    res.status(req.status)
    res.send(response);
  }
}