/*
Mongoose caught every error in validation, drop him, and keep only the message.
Therefore generate another ValidationError and join text explaining which field was afected alongside original message.

Then what we do to keep our code/msg/name is put them in a json with a TAG inside the message.
when error is caught in middleware for handler errors, the message is depured and restored
usigin CUT_TAG as a filter
Of course, we can just filter looking for '{' and '}' directly, but is generic and in future releases we will dont
know if the message compose format changes
*/
class _CustomErrorModels extends Error {
  constructor(message, code, nameError) {
    super(message);
    let TAG = {}
    TAG.name = nameError;
    TAG.code = code;
    TAG.message = message
    this.CUT_TAG = TAG
    Error.captureStackTrace(this, this.constructor);
  }
  setName(name) {
    this.name = name
  }
}
// One per Model:
class UserError extends _CustomErrorModels {
  constructor(message, code) {
    super(message, code, 'UserError');
    
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.UserError = UserError


//Base Extend to errors outside mongoose Scope
class _NormalError extends Error {
  constructor(message, code, nameError) {
    super(message);
    this.name = nameError
    this.code = code
    Error.captureStackTrace(this, this.constructor);
  }
  getError() {
    return { name: this.name, message: this.message, code: this.code }
  }
}
//One per type of errors
class AuthError extends _NormalError {
  constructor(message, code) {
    super(message, code, 'AuthError');
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.AuthError = AuthError

class RoleError extends _NormalError {
  constructor(message, code) {
    super(message, code, 'RoleError');
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.RoleError = RoleError