const { reqValidator } = require('../middlewares/request')
const v = require('../routes/threadValidators')
const passport = require('passport')
const { getCredentials } = require('../middlewares/getCredentials')
const response = require('../middlewares/response')
const ThreadController = require('../controllers/thread')
const CommentController = require('../controllers/comment')

const ServiceCheckOwner = require('../services/ownerCheckers')

/*#################################################################
    This file is the blueprint for register all routes of
    threads
#################################################################*/

const authenticate = passport.authenticate(['bearer', 'guest'], { session: false })

module.exports = {
  routes: {
    'startMiddlewares': [],

    '/api/v1/threads/': {
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

    '/api/v1/threads/:threadId/': {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getThreadSchema,
        description: 'Get Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.getById]
      },//
      'PATCH': {
        roleRequired: ['owner', 'admin', 'superadmin'],
        validator: v.updateThreadSchema,
        checkOwner: ServiceCheckOwner.thread,
        description: 'Update Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.update]
      },//
      'DELETE': {
        roleRequired: ['owner', 'admin', 'superadmin'],
        validator: v.getThreadSchema,
        checkOwner: ServiceCheckOwner.thread,
        description: 'Delete Thread',
        middlewares: [authenticate, getCredentials, reqValidator, ThreadController.delete]
      },//
    },

    '/api/v1/threads/:threadId/pin/': {
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

    '/api/v1/threads/:threadId/like/': {
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

    '/api/v1/threads/:threadId/comments/': {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getCommentsSchema,
        description: 'Get All Comments of Thread',
        middlewares: [authenticate, getCredentials, reqValidator, CommentController.getAll]
      },
      'POST': {
        roleRequired: ['user', 'moderator', 'admin', 'superadmin'],
        validator: v.createCommentSchema,
        description: 'Create Comment',
        middlewares: [authenticate, getCredentials, reqValidator, CommentController.createComment]
      },
    },

    '/api/v1/threads/:threadId/comments/:commentId': {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getCommentSchema,
        description: 'Get a Comment from Thread',
        //checkOwner: ServiceCheckOwner.comment,
        middlewares: [authenticate, getCredentials, reqValidator, CommentController.getById]
      },
      'DELETE': {
        roleRequired: ['owner', 'admin', 'superadmin'],
        validator: v.getCommentSchema,
        description: 'Delete a Comment from Thread',
        checkOwner: ServiceCheckOwner.comment,
        middlewares: [authenticate, getCredentials, reqValidator, CommentController.delete]
      },
    },

    'finishMiddlewares': [response.sendSuccess, response.sendError],

  }
}