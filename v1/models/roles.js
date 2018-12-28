module.exports = {
  levels: {
    guest: 0,
    user: 1,
    moderator: 2,
    admin: 3,
    owner: 7,
    superadmin: 10
  },
  default: 'user',
  guest: {
    username: 'guest',
    roles: ['guest']
  },

  routes: {
    "/api/v1/users/": {
      'GET': ['guest', 'user', 'moderator', 'admin', 'superadmin'],// 
      'POST': ['guest', 'admin', 'superadmin']
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
      'GET': ['owner','moderator', 'admin', 'superadmin']
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
  },
  /*
  GET: {
    "/api/v1/users/": {
      'guest': ['username', 'createdAt', 'banned', 'silenced'],
      'user': ['username', 'createdAt', 'banned', 'silenced', 'penalties'],
      'default': ['all']
    },
    "/api/v1/users/me": {
      'owner': ['all']
    },
    "/api/v1/users/:id": {
      'guest': ['username', 'createdAt', 'banned', 'silenced', '_id'],
      'user': ['username', 'createdAt', 'banned', 'silenced', '_id'],
      'default': ['all']
    },
    "/api/v1/users/:id/penalties": {
      'default': ['all']
    },
    "/api/v1/users/:id/penalties/bans": {
      'default': ['all']
    },
    "/api/v1/users/:id/penalties/silences": {
      'default': ['all']
    },
    "/api/v1/users/:id/roles": {
      'default': ['all']
    },
  },
  */

  READ: {
    user:{
      guest: ['username', 'createdAt', 'banned', 'silenced'],
      user: ['username', 'createdAt', 'banned', 'silenced'],
      moderator: ['username', 'createdAt', 'updatedAt', 'banned', 'silenced', 'penalties'],
      owner:['username', 'createdAt', 'updatedAt', 'banned', 'silenced', 'penalties'],
      admin: ['all'],
      superadmin: ['all']
    },
    penalty:{
      guest: ['none'],
      user: ['none'],
      moderator: ['reason','author', 'user', 'expiresAt', 'kind', 'createdAt'],
      owner:['reason', 'user', 'expiresAt', 'kind', 'createdAt'],
      admin: ['all'],
      superadmin: ['all']
    }

  },
  POST: {
    "/api/v1/users/:id/penalties/bans": {
      'default': ['all']
    },
    "/api/v1/users/:id/penalties/silences": {
      'default': ['all']
    },
    "/api/v1/users/:id/roles": {
      'default': ['all']
    },

  },
  DELETE: {
    "/api/v1/users/:id/roles": {
      'default': ['all']
    },
    "/api/v1/users/:id/penalties/bans/:banId": {
      'default': ['all']
    },
    "/api/v1/users/:id/penalties/silences/:silenceId": {
      'default': ['all']
    },
  }
}