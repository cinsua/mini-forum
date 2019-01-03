const Joi = require('joi');
const roles = require('../models/roles')

/*#################################################################
#         Field level schema validations                          #
#################################################################*/

const mongooseIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

// threads
const titleSchema = Joi.string().min(4).max(50)
const contentThreadSchema = Joi.string().min(4).max(3000)
const private = Joi.boolean()

// Comments
const contentCommentSchema = Joi.string().min(3).max(300)


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

const baseThreadSchema = Joi.object().keys({
  body: {
    title: titleSchema.required(),
    content: contentThreadSchema.required(),
    private: private
  },
})


module.exports = {
  
  createThreadSchema: baseThreadSchema
    .concat(noParamsSchema)
    .concat(noQuerySchema),

  getThreadsSchema: paginationQuerySchema
    .concat(noParamsSchema)
    .concat(noBodySchema),
}