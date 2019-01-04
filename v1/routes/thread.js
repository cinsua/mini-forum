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
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.getAll] //getCredentials,
      },// 
      'POST': {
        roleRequired: ['user', 'moderator', 'admin', 'superadmin'],
        validator: v.createThreadSchema,
        description: 'Create Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.createThread] //getCredentials,
      },
    },
    "/api/v1/threads/:threadId/": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getThreadSchema,
        description: 'Get Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.getById] //getCredentials,
      },//
    },




    "finishMiddlewares": [response.sendSuccess, response.sendError],

  }
}