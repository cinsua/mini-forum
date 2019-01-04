
errors = {
  TEST_CODE: {
    name: '',
    message: ''
  },
  // User creation
  USER_CREATION_PW_SHORT: {
    name: 'UserCreation',
    message: 'Password is too short, require at least 4 characters'
  },
  USER_CREATION_UNAME_SHORT: {
    name: 'UserCreation',
    message: 'Username is too short, require at least 4 characters'
  },
  USER_CREATION_PW_UNAME_REQUIRED: {
    name: 'UserCreation',
    message: 'You must provide username and password to create an user'
  },
  // User login
  LOGIN_PW_UNAME_REQUIRED: {
    name: 'UserLogin',
    message: 'You must provide username and password for login'
  },
  LOGIN_PW_UNAME_INVALID: {
    name: 'UserLogin',
    message: 'Username/Password combination are not valid'
  },
  LOGIN_USER_BANNED: {
    name: 'UserLogin',
    message: 'User is banned'
  },
  LOGIN_REQUIRED: {
    name: 'UserLogin',
    message: 'You must be logged in to access'
  },

  // RESOURCES
  REQUEST_USER_NOT_FOUND: {
    name: 'RequestUser',
    message: 'Requested user not found'
  },

  REQUEST_PENALTY_NOT_FOUND: {
    name: 'RequestPenalty',
    message: 'Requested penalty not found'
  },

  ASSIGNMENT_ROLE_INVALID: {
    name: 'RoleError',
    message: 'You must provide a valid role'
  },

  ASSIGNMENT_ROLE_ALREADY_PRESENT: {
    name: 'RoleError',
    message: 'The user already have the role requested'
  },

  ASSIGNMENT_ROLE_NOT_PRESENT: {
    name: 'RoleError',
    message: 'The user doesnt have the role requested'
  },

  REQUEST_THREAD_NOT_FOUND: {
    name: 'RequestThread',
    message: 'Requested Thread not found'
  },

  REQUEST_THREAD_IS_PRIVATED: {
    name: 'RequestThread',
    message: 'Requested Thread is privated. Please log in or register'
  },

  // PRIVILEGES
  AUTH_INSUFFICIENT_PRIVILEGES: {
    name: 'AuthorizationError',
    message: 'You do not have sufficient privileges'
  },

}

module.exports.errors = errors