/*
Mongoose intercepts every error in validation, drop him, and keep the message.
Therefore generate another ValidationError and boilerplate the message inside other
comments.

Then what we do to keep our code/msg/name is put them in a json inside the message.
when error is caught in middleware for handler errors, the message is depured y restored
from CUT_TAG
*/
class CustomError extends Error {
    constructor(message, code,nameError) {
      super(message);
    // Ensure the name of this error is the same as the class name
      let TAG={}
      TAG.name = nameError;
      TAG.code = code;
      TAG.message = message
      this.CUT_TAG=TAG
      Error.captureStackTrace(this, this.constructor);
    }
    setName(name) {
        this.name = name
    }
  }
class UserError extends CustomError {
    constructor(message, code) {
      super(message, code, 'UserError');
      //this.CUT_TAG.name = this.constructor.name
      Error.captureStackTrace(this, this.constructor);
    }
  }

module.exports.UserError = UserError