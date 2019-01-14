//default response to all success scenarios AND all errors
const server = require('../../tools/serverTools')
const CONFIG = require('../../config/config')
const hateoas = require('../services/hateoas')

module.exports = {
  async sendSuccess(req, res, next) {

    res.setHeader('Content-Type', 'application/json')

    // This handle all request in API/V1/* that not received treatment, can be in another middleware
    if (!req.data && !req.status) {
      req.status = 404
      res.status(req.status)
      res.send('Not Found in API/v1')
      return next()
    }

    let response = {
      data: hateoas.addLinks(req.data, req.credentials, req.app.routes, { paginationInfo: req.paginationInfo }),
      success: true
    }

    if (!req.status) req.status = 200
    res.status(req.status)
    res.send(response)
    return next()

  },

  async sendError(err, req, res, next) {

    res.setHeader('Content-Type', 'application/json')
    let errors = []

    // if it is a custom error has getError() defined
    // if it is a request Joi validation has isJoi = true
    // if not any of above, we dont know, and put the stacktrace in response (thinking of ticket system maybe)

    // TODO intercept mongo 11000 error
    if (err.getError)
      errors.push(err.getError())
    else if (err.isJoi)
      errors = err.details.map((detail) => ({ code: 'REQUEST_VALIDATION', name: err.name, message: detail.message }))
    else
      errors.push({ name: err.name, message: err.message, code: err.code, stack: err.stack })

    let response = {
      success: false,
      data: req.data,
      errors
    }

    // TODO use standar status codes
    if (!req.status) req.status = 500

    if (CONFIG.TRACE_ERRORS_CONSOLE)
      server.showTrace(errors, err)

    res.status(req.status)
    res.send(response)
  }
}