const { reqValidator } = require('../middlewares/request')
const v = require('../routes/threadValidators')
const CONFIG = require('../../config/config')
const passport = require('passport');
const { getCredentials } = require('../middlewares/getCredentials')

const response = require('../middlewares/response')

const ThreadController = require('../controllers/thread');

/*#################################################################
#         This file register the relation between                 #               
#         routes with roleRequired/validator/description          #
#################################################################*/

const authenticate = passport.authenticate(['bearer', 'guest'], { session: false })

module.exports = {
  routes: {
    "startMiddlewares": [],

    "/api/v1/threads/": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getThreadsSchema,
        description: 'Get All Threads',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.getAll]
      },// 
      'POST': {
        roleRequired: ['user', 'moderator', 'admin', 'superadmin'],
        validator: v.createThreadSchema,
        description: 'Create Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.createThread]
      },
    },
    "/api/v1/threads/:threadId/": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getThreadSchema,
        description: 'Get Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.getById]
      },//
      'PATCH': {
        roleRequired: ['user', 'owner', 'admin', 'superadmin'],
        validator: v.updateThreadSchema,
        description: 'Update Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.update]
      },//
      'DELETE': {
        roleRequired: ['user', 'owner', 'admin', 'superadmin'],
        validator: v.getThreadSchema,
        description: 'Delete Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.delete]
      },//
    },
    "/api/v1/threads/:threadId/pin/": {
      'POST': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.pinThreadSchema,
        description: 'Pin Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.pin]
      },//
      'DELETE': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.pinThreadSchema,
        description: 'Unpin Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.unpin]
      },//
    },
    "/api/v1/threads/:threadId/like/": {
      'POST': {
        roleRequired: ['user', 'moderator', 'admin', 'superadmin'],
        validator: v.pinThreadSchema,
        description: 'Like Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.like]
      },//
      'DELETE': {
        roleRequired: ['user', 'moderator', 'admin', 'superadmin'],
        validator: v.pinThreadSchema,
        description: 'Unlike Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.unlike]
      },//
    },




    "finishMiddlewares": [response.sendSuccess, response.sendError],

  }
}