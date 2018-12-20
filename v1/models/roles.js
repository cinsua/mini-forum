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
    "/api/v1/users/:id/penalties/bans": {
      'POST': ['admin', 'superadmin'],
      'GET': ['owner', 'admin', 'superadmin']
    },
  },

  GET: {
    "/api/v1/users/": {
      'guest': ['username', 'createdAt', 'banned', 'silenced'],
      'user': ['username', 'createdAt', 'banned', 'silenced','penalties'],
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
    "/api/v1/users/:id/penalties/bans": {
      'default': 'all'
    }
  },
  POST:{

  }
}