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
const reasonSchema = Joi.string().min(3).max(300).lowercase()
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
    expirePenalty: expirePenaltySchema
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
module.exports = {
  loginUserSchema: baseUserSchema.concat(noParamsSchema).concat(noQuerySchema),
  createUserSchema: baseUserSchema.concat(noParamsSchema).concat(noQuerySchema),
  getUsersSchema :paginationQuerySchema.concat(noParamsSchema).concat(noBodySchema),
  getUserSchema :baseGetUserSchema.concat(noBodySchema).concat(noQuerySchema),
  getPenaltiesSchema: baseGetUserSchema.concat(paginationQuerySchema).concat(noBodySchema),
  createPenaltySchema: baseCreatePenaltySchema.concat(baseGetUserSchema).concat(noQuerySchema),
  getPenaltySchema : baseGetPenaltySchema.concat(baseGetUserSchema).concat(noBodySchema).concat(noQuerySchema),
  setRoleSchema : baseRoleSchema.concat(baseGetUserSchema).concat(noQuerySchema),
}