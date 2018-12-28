const Joi = require('joi');
const roles = require('../models/roles')

/*#################################################################
#         Field level schema validations                          #
#################################################################*/

const mongooseIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

// User
const usernameSchema = Joi.string().alphanum().min(4).max(20).lowercase()
const passwordSchema = Joi.string().regex(/^[a-zA-Z0-9]{4,30}$/)
const roleSchema = Joi.string().lowercase().valid(Object.keys(roles.levels)).invalid('owner')
const rolesSchema = Joi.array().items(roleSchema)

// Penalty
const reasonSchema = Joi.string().alphanum().min(3).max(300).lowercase()
const timePenaltySchema = Joi.number().positive()
const expirePenaltySchema = Joi.date().min('now');

// pagination
const pageSchema = Joi.number().positive()
const limitSchema = Joi.number().positive()

/*#################################################################
#         Modular schema validations                              #
#################################################################*/

const noBodySchema = Joi.object().keys({
  body: {}
})
const noQuerySchema = Joi.object().keys({
  query: {}
})
const noParamsSchema = Joi.object().keys({
  params: {}
})
const anyQuerySchema = Joi.object().keys({
  query: Joi.any()
})
const anyParamsSchema = Joi.object().keys({
  params: Joi.any()
})
const noReqSchema = Joi.object().keys({
  params: {}, query: {}, body: {}
})

const paginationQuerySchema = Joi.object().keys({
  query: {
    page: pageSchema,
    limit: limitSchema
  },
})

const baseCreatePenaltySchema = Joi.object().keys({
  body: {
    reason: reasonSchema.required(), 
    timePenalty: timePenaltySchema, 
    expirePenalty:expirePenaltySchema
  } 
}).xor('body.expirePenalty', 'body.timePenalty')

const baseUserSchema = Joi.object().keys({
  body: {
    username: usernameSchema.required(),
    password: passwordSchema.required(),
  },
})

const baseRoleSchema = Joi.object().keys({
  body: {
    role: roleSchema.required(),
  },
})
const baseGetUserSchema = Joi.object().keys({
  params: {
    id: Joi.alternatives().try(usernameSchema, mongooseIdSchema)//Joi.valid(usernameSchema, mongooseIdSchema).required()
  }
})
const baseGetPenaltySchema = Joi.object().keys({
  params: {
    banId: mongooseIdSchema,//Joi.valid(usernameSchema, mongooseIdSchema).required()
    silenceId: mongooseIdSchema
  }
}).xor('params.banId', 'params.silenceId')

/*#################################################################
#         Final Form schema validations                           #
#################################################################*/

const loginUserSchema = baseUserSchema.concat(noParamsSchema).concat(noQuerySchema)
const createUserSchema = baseUserSchema.concat(noParamsSchema).concat(noQuerySchema)
const getUsersSchema = paginationQuerySchema.concat(noParamsSchema).concat(noBodySchema)
const getUserSchema = baseGetUserSchema.concat(noBodySchema).concat(noQuerySchema)
const getPenaltiesSchema = baseGetUserSchema.concat(paginationQuerySchema).concat(noBodySchema)
const createPenaltySchema = baseCreatePenaltySchema.concat(baseGetUserSchema).concat(noQuerySchema)
const getPenaltySchema = baseGetPenaltySchema.concat(baseGetUserSchema).concat(noBodySchema).concat(noQuerySchema)
const setRoleSchema = baseRoleSchema.concat(baseGetUserSchema).concat(noQuerySchema)

/*#################################################################
#         Route > method > schemaRequired                         #
#################################################################*/

const routes = {
  "/api/v1/": {
    'GET': noReqSchema,// 
  },
  "/api/v1/users/": {
    'GET': getUsersSchema, 
    'POST': createUserSchema
  },
  "/api/v1/users/login": {
    'POST': loginUserSchema
  },
  "/api/v1/users/:id": {
    'GET': getUserSchema,
    'DELETE': getUserSchema,
    'PATCH': ['admin', 'owner', 'superadmin'],
  },
  "/api/v1/users/:id/penalties": {
    'GET': getPenaltiesSchema
  },
  "/api/v1/users/:id/penalties/bans": {
    'POST': createPenaltySchema,
    'GET': getPenaltiesSchema
  },
  "/api/v1/users/:id/penalties/silences": {
    'POST': createPenaltySchema,
    'GET': getPenaltiesSchema
  },
  "/api/v1/users/:id/roles": {
    'GET': getUserSchema,
    'DELETE': setRoleSchema,
    'POST': setRoleSchema,
  },
  "/api/v1/users/:id/penalties/bans/:banId": {
    'DELETE': getPenaltySchema,
  },
  "/api/v1/users/:id/penalties/silences/:silenceId": {
    'DELETE': getPenaltySchema,
  },
}

/*#################################################################
#         Finally the Middleware                                  #
#################################################################*/
module.exports = {
  reqValidator: async function (req, res, next) {
    schemaValidation = routes[req.baseUrl + req.route.path][req.method]
    request = {
      body: req.body,
      params: req.params,
      query: req.query
    }
    const result = Joi.validate(request, schemaValidation, { abortEarly: false });
    if (result.error) {
      //console.log(Object.keys(result.error))
      //console.log(result.error.details)
      //console.log('isjoy', result.error.isJoi)
      //console.log(result.error.name)
      next(result.error)
    }
    req.validRequest = result.value
    next()
  }
}