const Joi = require('joi');
const {routes} = require('../routes/registeredRoutes')

module.exports = {
  reqValidator: async function (req, res, next) {
    schemaValidation = routes[req.baseUrl + req.route.path][req.method].validator
    request = {
      body: req.body,
      params: req.params,
      query: req.query
    }
    const result = Joi.validate(request, schemaValidation, { abortEarly: false });
    if (result.error) {
      next(result.error)
    }
    req.validRequest = result.value
    next()
  }
}