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