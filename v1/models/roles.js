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
  READ: {
    user: {
      guest: ['username', 'createdAt', 'banned', 'silenced'],
      user: ['username', 'createdAt', 'banned', 'silenced'],
      moderator: ['username', 'createdAt', 'updatedAt', 'banned', 'silenced', 'penalties'],
      owner: ['username', 'createdAt', 'updatedAt', 'banned', 'silenced', 'penalties'],
      admin: ['all'],
      superadmin: ['all']
    },
    penalty: {
      guest: ['none'],
      user: ['none'],
      moderator: ['reason', 'author', 'user', 'expiresAt', 'kind', 'createdAt'],
      owner: ['reason', 'user', 'expiresAt', 'kind', 'createdAt'],
      admin: ['all'],
      superadmin: ['all']
    }

  },
}