const Joi = require('joi')

module.exports = {
  reqValidator(req, res, next) {

    let schemaValidation = req.app.routes[req.baseUrl + req.route.path][req.method].validator

    // simplified version of req, takes only the client inputs
    let request = {
      body: req.body,
      params: req.params,
      query: req.query
    }

    const result = Joi.validate(request, schemaValidation, { abortEarly: false })
    if (result.error)
      next(result.error)


    // req.validRequest is the simplified version validated. we will use only this in the req treatment
    req.validRequest = result.value
    next()
  }

}