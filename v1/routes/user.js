const { reqValidator } = require('../middlewares/request')
const v = require('../routes/userValidators')
const CONFIG = require('../../config/config')
const passport = require('passport')
const { getCredentials } = require('../middlewares/getCredentials')

const response = require('../middlewares/response')
const UserController = require('../controllers/user')
const PenaltyController = require('../controllers/penalty')
const hateoas = require('../services/hateoas')
const ServiceCheckOwner = require('../services/ownerCheckers')

function aliveChecker(req, res, next) {
  let data = { message: 'Server running', user: req.user.username, version: CONFIG.VERSION, commit: CONFIG.COMMIT }
  req.data = hateoas.addLinks(data, req.credentials, req.app.routes)
  next()
}

/*#################################################################
    This file is the blueprint for register all routes of
    users
#################################################################*/

const authenticate = passport.authenticate(['bearer', 'guest'], { session: false })

module.exports = {
  routes: {
    'startMiddlewares': [],

    '/api/v1/': {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.noReqSchema,
        description: 'Get Server Status',
        middlewares: [authenticate, getCredentials, reqValidator, aliveChecker]
      },// 
    },

    '/api/v1/users/': {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getUsersSchema,
        description: 'Get all users',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.getAll]
      },
      'POST': {
        roleRequired: ['guest', 'admin', 'superadmin'],
        validator: v.createUserSchema,
        description: 'Create user',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.createUser]
      },
    },

    '/api/v1/users/login/': {
      'POST': {
        roleRequired: ['guest'],
        validator: v.loginUserSchema,
        description: 'Login',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.login]
      },
    },

    '/api/v1/users/:id/': {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Get user',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.getById]
      },
      'DELETE': {
        roleRequired: ['admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Delete User',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.deleteMe]
      },
      'PATCH': {
        roleRequired: ['admin', 'owner', 'superadmin'],
        validator: '',
        checkOwner: ServiceCheckOwner.user,
        description: 'Update User',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.updateMe]
      },
    },

    '/api/v1/users/:id/bans/': {
      'POST': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.createPenaltySchema,
        description: 'Create Ban',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.banUser]
      },
      'GET': {
        roleRequired: ['owner', 'moderator', 'admin', 'superadmin'],
        validator: v.getPenaltiesSchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Get Bans',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.getBans]
      },
    },

    '/api/v1/users/:id/silences/': {
      'POST': {
        roleRequired: ['moderator', 'admin', 'superadmin'],
        validator: v.createPenaltySchema,
        description: 'Create Silence',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.silenceUser]
      },
      'GET': {
        roleRequired: ['owner', 'moderator', 'admin', 'superadmin'],
        validator: v.getPenaltiesSchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Get Silences',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.getSilences]
      },
    },

    '/api/v1/users/:id/roles/': {
      'GET': {
        roleRequired: ['user', 'moderator', 'admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Get Roles',
        middlewares: [authenticate, getCredentials, reqValidator, aliveChecker]
      },
      'DELETE': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.setRoleSchema,
        description: 'Delete Role',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.removeRole]
      },
      'POST': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.setRoleSchema,
        description: 'Add Role',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.addRole]
      },
    },

    '/api/v1/users/:id/bans/:banId/': {
      'GET': {
        roleRequired: ['owner', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Get Ban',
        middlewares: [authenticate, getCredentials, reqValidator, aliveChecker]
      },
      'DELETE': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Delete Ban',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.removeBan]
      },
    },

    '/api/v1/users/:id/silences/:silenceId/': {
      'GET': {
        roleRequired: ['moderator', 'owner', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        checkOwner: ServiceCheckOwner.user,
        description: 'Get Silence',
        middlewares: [authenticate, getCredentials, reqValidator, aliveChecker]
      },
      'DELETE': {
        roleRequired: ['moderator', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Delete Silence',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.removeSilence]
      },
    },

    'finishMiddlewares': [response.sendSuccess, response.sendError],
  },


}



// old way
/*
const express = require('express')
const userRouter = express.Router()

const UserController = require('../controllers/user')
const PenaltyController = require('../controllers/penalty')
const { getCredentials } = require('../middlewares/getCredentials')
const { reqValidator } = require('../middlewares/request')
*/
/*
TODO LIST
put a serious logger
get routes for bans/silences/roles
delete user
remove update user. view the change password token
*/
/*
const passport = require('passport')
let passp = passport.authenticate(['bearer', 'guest'], { session: false })
*/
/*#################################################################
#         All routes api/v1/users/*                               #
#################################################################*/
/*
userRouter.use(passp)

userRouter.route('/')
  .get(getCredentials, reqValidator, UserController.getAll)
  .post(getCredentials, reqValidator, UserController.createUser)

//works users/:id users/username users/me
userRouter.route('/:id')
  .get(getCredentials, reqValidator, UserController.getById)
  .delete(getCredentials, reqValidator, UserController.deleteMe)
  // patch should be redone
  .patch(getCredentials, UserController.updateMe)

userRouter.route('/login')
  .post(getCredentials, reqValidator, UserController.login)

userRouter.route('/:id/bans')
  .post(getCredentials, reqValidator, PenaltyController.banUser)
  .get(getCredentials, reqValidator, PenaltyController.getBans)

// TODO get
userRouter.route('/:id/bans/:banId')
  .delete(getCredentials, reqValidator, PenaltyController.removeBan)

userRouter.route('/:id/silences')
  .post(getCredentials, reqValidator, PenaltyController.silenceUser)
  .get(getCredentials, reqValidator, PenaltyController.getSilences)

// TODO get
userRouter.route('/:id/silences/:silenceId')
  .delete(getCredentials, reqValidator, PenaltyController.removeSilence)

// TODO get route
userRouter.route('/:id/roles')
  .post(getCredentials, reqValidator, UserController.addRole)
  .delete(getCredentials, reqValidator, UserController.removeRole)

module.exports = userRouter*/