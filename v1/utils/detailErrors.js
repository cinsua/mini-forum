
const errors = {
  // User login
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

  REQUEST_PENALTY_HAS_DIFFERENT_USER: {
    name: 'RequestPenalty',
    message: 'Requested Penalty has a reference to a different User'
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

  THREAD_ALREADY_LIKED: {
    name: 'ThreadError',
    message: 'You already like this thread'
  },
  THREAD_NOT_LIKED: {
    name: 'ThreadError',
    message: 'You already do not like this thread'
  },

  REQUEST_COMMENT_NOT_FOUND: {
    name: 'RequestComment',
    message: 'Requested Comment not found'
  },

  REQUEST_COMMENT_HAS_DIFFERENT_THREAD: {
    name: 'RequestComment',
    message: 'Requested Comment has a reference to a different thread'
  },

}

module.exports.errors = errors