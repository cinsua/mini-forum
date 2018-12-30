const v = require('../routes/validators')

/*#################################################################
#         This file register the relation between                 #               
#         routes with roleRequired/validator/description          #
#################################################################*/

module.exports = {
  routes: {
    "/api/v1/": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.noReqSchema,
        description: 'Get Server Status'
      },// 
    },
    "/api/v1/users/": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'superadmin'],
        validator: v.getUsersSchema,
        description: 'Get all users'
      },
      'POST': {
        roleRequired: ['guest', 'admin', 'superadmin'],
        validator: v.createUserSchema,
        description: 'Create user'
      },
    },
    "/api/v1/users/login": {
      'POST': {
        roleRequired: ['guest'],
        validator: v.loginUserSchema,
        description: 'Login'
      },
    },
    "/api/v1/users/:id": {
      'GET': {
        roleRequired: ['guest', 'user', 'moderator', 'admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        description: 'Get user'
      },
      'DELETE': {
        roleRequired: ['admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        description: 'Delete User'
      },
      'PATCH': {
        roleRequired: ['admin', 'owner', 'superadmin'],
        validator: '',
        description: 'Update User'
      },
    },
    "/api/v1/users/:id/bans": {
      'POST': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.createPenaltySchema,
        description: 'Create Ban'
      },
      'GET': {
        roleRequired: ['owner', 'moderator', 'admin', 'superadmin'],
        validator: v.getPenaltiesSchema,
        description: 'Get Bans'
      },
    },
    "/api/v1/users/:id/silences": {
      'POST': {
        roleRequired: ['moderator', 'admin', 'superadmin'],
        validator: v.createPenaltySchema,
        description: 'Create Silence'
      },
      'GET': {
        roleRequired: ['owner', 'moderator', 'admin', 'superadmin'],
        validator: v.getPenaltiesSchema,
        description: 'Get Silences'
      },
    },
    "/api/v1/users/:id/roles": {
      'GET': {
        roleRequired: ['user', 'moderator', 'admin', 'owner', 'superadmin'],
        validator: v.getUserSchema,
        description: 'Get Roles'
      },
      'DELETE': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.setRoleSchema,
        description: 'Delete Role'
      },
      'POST': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.setRoleSchema,
        description: 'Add Role'
      },
    },
    "/api/v1/users/:id/bans/:banId": {
      'GET': {
        roleRequired: ['owner', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Get Ban'
      },
      'DELETE': {
        roleRequired: ['admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Delete Ban'
      },
    },
    "/api/v1/users/:id/silences/:silenceId": {
      'GET': {
        roleRequired: ['moderator', 'owner', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Get Silence'
      },
      'DELETE': {
        roleRequired: ['moderator', 'admin', 'superadmin'],
        validator: v.getPenaltySchema,
        description: 'Delete Silence'
      },
    },
  },
}