const Joi = require('joi');
const roles = require('../models/roles')



//---------------------------------------------------------------
//
//  Field level schema validations
//
//---------------------------------------------------------------

const mongooseIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

// User
const usernameSchema = Joi.string().alphanum().min(3).max(30).lowercase()
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

const schemaTest = { //Joi.object().keys(
  body: {
    username: usernameSchema.required(),
    //expiresPenalty: Joi.string().alphanum().min(3).max(30),
    timePenalty: timePenaltySchema,
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    expirePenalty: expirePenaltySchema
    //role: roleSchema,
    //roles:rolesSchema
  },
  params: Joi.any(),
  query: Joi.any(),

}
//password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
//access_token: [Joi.string(), Joi.number()],
//birthyear: Joi.number().integer().min(1900).max(2013),
//email: Joi.string().email({ minDomainAtoms: 2 })

//.with('username', 'password')
//.without('body.expiresPenalty', 'body.timePenalty');

//.with(params required together)
//.withouth(params required exclusively)


const createUserSchema =
  Joi.object().keys({
    body: {
      username: usernameSchema.required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    },
    params: {},//Joi.any(),
    query: {}//Joi.any(),
  })
const getUsersSchema =
  Joi.object().keys({
    body: {},
    params: {},
    query: {
      page: pageSchema,
      limit: limitSchema
    },
  })

const routes = {
  "/api/v1/": {
    'GET': getUsersSchema,// 
    'POST': createUserSchema
  },
  "/api/v1/users/": {
    'GET': Joi.any(),// 
    'POST': createUserSchema
  },
  "/api/v1/users/me": {
    'GET': ['guest', 'user', 'moderator', 'admin', 'owner', 'superadmin'],
    'DELETE': ['user', 'moderator', 'admin', 'owner', 'superadmin'],
    'PATCH': ['user', 'moderator', 'admin', 'owner', 'superadmin'],
  },
  "/api/v1/users/login": {
    'POST': ['guest']
  },
  "/api/v1/users/:id": {
    'GET': ['guest', 'user', 'moderator', 'admin', 'owner', 'superadmin'],
    'DELETE': ['admin', 'owner', 'superadmin'],
    'PATCH': ['admin', 'owner', 'superadmin'],
  },
  "/api/v1/users/:id/penalties": {
    'GET': ['owner', 'moderator', 'admin', 'superadmin']
  },
  "/api/v1/users/:id/penalties/bans": {
    'POST': ['admin', 'superadmin'],
    'GET': ['owner', 'moderator', 'admin', 'superadmin']
  },
  "/api/v1/users/:id/penalties/silences": {
    'POST': ['moderator', 'admin', 'superadmin'],
    'GET': ['owner', 'moderator', 'admin', 'superadmin']
  },
  "/api/v1/users/:id/roles": {
    'GET': ['guest', 'user', 'moderator', 'admin', 'owner', 'superadmin'],
    'DELETE': ['admin', 'superadmin'],
    'POST': ['admin', 'superadmin'],
  },
  "/api/v1/users/:id/penalties/bans/:banId": {
    'DELETE': ['admin', 'superadmin'],
  },
  "/api/v1/users/:id/penalties/silences/:silenceId": {
    'DELETE': ['moderator', 'admin', 'superadmin'],
  },
}

module.exports = {
  reqValidation: async function (req, res, next) {
    console.log(req.baseUrl + req.route.path)
    schemaValidation = routes[req.baseUrl + req.route.path][req.method]
    request = {
      body: req.body,
      params: req.params,
      query: req.query
    }
    const result = Joi.validate(request, schemaValidation, { abortEarly: false });
    if (result.error) {
      console.log(Object.keys(result.error))
      console.log(result.error.details)
      console.log('isjoy', result.error.isJoi)
      console.log(result.error.name)
      next(result.error)
    }
    console.log(result.value)
    console.log(!Object.keys(result.value.query).length)
    next()
  }
}