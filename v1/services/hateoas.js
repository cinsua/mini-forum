
/*#################################################################
#         Fill the response with posible links                    #
#################################################################*/

module.exports = {
  createUser: async (user) => {
    return {
      message: 'User Created',
      user: {
        username: user.username,
        links: [{
          type: 'GET', rel: 'self',
          href: '/api/v1/users/me'
        },
        {
          type: 'POST', rel: 'login',
          href: '/api/v1/users/login',
          atributtes: 'Body: username, password'
        }]
      },
    }
     
  },
  listOfUsers: async (users, pagination) => {
    data = {}
    data.pages = pagination.pages
    data.page = pagination.page
    data.total = pagination.total
    data.limit = pagination.limit
    data.links = [{
      type: 'GET', rel: 'first',
      href: `/api/v1/users/?page=1&limit=${pagination.limit}`
    },
    {
      type: 'GET', rel: 'last',
      href: `/api/v1/users/?page=${pagination.pages}&limit=${pagination.limit}`
    },
    ]
    if (pagination.page > 1)
      data.links.push({
        type: 'GET', rel: 'prev',
        href: `/api/v1/users/?page=${pagination.page - 1}&limit=${pagination.limit}`
      })
    if (pagination.page < pagination.pages)
      data.links.push({
        type: 'GET', rel: 'next',
        href: `/api/v1/users/?page=${pagination.page + 1}&limit=${pagination.limit}`
      })
    data.users = users

    return data
  },

  singleUser: async (user, readFields, roles, queryUrl) => {
    console.log('roles :', roles);
    readFieldsUser = readFields.user
    if (roles.includes('owner'))
      user.links = [{
        type: 'GET', rel: 'self',
        href: `/api/v1/users/me`
      }]
    
    // read
    if (readFieldsUser.includes('penalties') || readFieldsUser.includes('all')) {
      user.links.push({
        type: 'GET', rel: 'penalties',
        href: user.links[0].href + '/penalties'
      })
      user.links.push({
        type: 'GET', rel: 'bans',
        href: user.links[0].href + '/penalties/bans'
      })
      user.links.push({
        type: 'GET', rel: 'silences',
        href: user.links[0].href + '/penalties/silences'
      })
    }

    if (roles.includes('owner')) {
      user.links.push({
        type: 'DELETE', rel: 'DeleteUser',
        href: user.links[0].href
      })
    }

    if ((roles.includes('moderator') ||
      roles.includes('admin')) &&
      !roles.includes('owner')) {

      user.links.push({
        type: 'POST', rel: 'SilenceUser',
        href: user.links[0].href + '/penalties/silences',
        atributtes: 'Body: Reason. timePenalty or expireDate'
      })
    }

    if (roles.includes('admin') &&
      !roles.includes('owner')) {

      user.links.push({
        type: 'POST', rel: 'BanUser',
        href: user.links[0].href + '/penalties/bans',
        atributtes: 'Body: Reason. timePenalty or expireDate'
      })

      user.links.push({
        type: 'POST', rel: 'AddRole',
        href: user.links[0].href + '/roles',
        atributtes: 'Body: role'
      })

      user.links.push({
        type: 'DELETE', rel: 'DeleteRole',
        href: user.links[0].href + '/roles',
        atributtes: 'Body: role'
      })

    }

    return user
  }
}