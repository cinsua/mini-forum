const { reqValidator } = require('../middlewares/request')
const v = require('../routes/validators')
const CONFIG = require('../../config/config')
const passport = require('passport');
const { getCredentials } = require('../middlewares/getCredentials')

const response = require('../middlewares/response')

const UserController = require('../controllers/user');
const PenaltyController = require('../controllers/penalty');

/*#################################################################
#         This file register the relation between                 #               
#         routes with roleRequired/validator/description          #
#################################################################*/

const authenticate = passport.authenticate(['bearer', 'guest'], { session: false })

module.exports = {
  routes: {
    "startMiddlewares": [],
    "/api/v1/": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.noReqSchema,
        description: 'Get Server Status',
        middlewares: [authenticate, getCredentials, reqValidator, hello] //getCredentials,
      },// 
    },
    "/api/v1/users/": {
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
    "/api/v1/users/login": {
      'POST': {
        roleRequired: ['guest'],
        validator: v.loginUserSchema,
        description: 'Login',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.login]
      },
    },
    "/api/v1/users/:id": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        description: 'Get user',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.getById]
      },
      'DELETE': {
        roleRequired: ['admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        description: 'Delete User',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.deleteMe]
      },
      'PATCH': {
        roleRequired: ['admin', 'owner', 'superadmin'],
        validator: '',
        description: 'Update User',
        middlewares: [authenticate, getCredentials, reqValidator, UserController.updateMe]
      },
    },
    "/api/v1/users/:id/bans": {
      'POST': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.createPenaltySchema,
        description: 'Create Ban',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.banUser]
      },
      'GET': {
        roleRequired: ['owner', 'moderator', 'admin', 'superadmin'],
        validator: v.getPenaltiesSchema,
        description: 'Get Bans',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.getBans]
      },
    },
    "/api/v1/users/:id/silences": {
      'POST': {
        roleRequired: ['moderator', 'admin', 'superadmin'],
        validator: v.createPenaltySchema,
        description: 'Create Silence',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.silenceUser]
      },
      'GET': {
        roleRequired: ['owner', 'moderator', 'admin', 'superadmin'],
        validator: v.getPenaltiesSchema,
        description: 'Get Silences',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.getSilences]
      },
    },
    "/api/v1/users/:id/roles": {
      'GET': {
        roleRequired: ['user', 'moderator', 'admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        description: 'Get Roles',
        middlewares: [authenticate, getCredentials, reqValidator, hello]
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
    "/api/v1/users/:id/bans/:banId": {
      'GET': {
        roleRequired: ['owner', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Get Ban',
        middlewares: [authenticate, getCredentials, reqValidator, hello]
      },
      'DELETE': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Delete Ban',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.removeBan]
      },
    },
    "/api/v1/users/:id/silences/:silenceId": {
      'GET': {
        roleRequired: ['moderator', 'owner', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Get Silence',
        middlewares: [authenticate, getCredentials, reqValidator, hello]
      },
      'DELETE': {
        roleRequired: ['moderator', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Delete Silence',
        middlewares: [authenticate, getCredentials, reqValidator, PenaltyController.removeSilence]
      },
    },
    "finishMiddlewares": [response.sendSuccess,response.sendError],
  },


}

function hello(req, res, next) {
  req.data = { message: 'Server running', user: user.username, version: CONFIG.VERSION, commit: CONFIG.COMMIT }

  next()

}