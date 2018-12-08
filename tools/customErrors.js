class CustomError extends Error {
    constructor(message, code, name) {
      super(message);
     // Ensure the name of this error is the same as the class name
      let TAG={}
      TAG.message = message
      TAG.name = name;
      TAG.code = code;
      //console.log(this.name, this.code)
      this.CUT_TAG=TAG
     // This clips the constructor invocation from the stack trace.
     // It's not absolutely essential, but it does make the stack trace a little nicer.
     //  @see Node.js reference (bottom)
     Error.captureStackTrace(this, this.constructor);
     //console.log(captureStackTrace(this, this.constructor))
    }
    setName(name) {
        this.name = name
    }
  }
class UserError extends CustomError {
    constructor(message, code) {
      super(message, code, 'UserError');
      //this.setName(this.constructor.name)
     // Ensure the name of this error is the same as the class name
      //let TAG={}
      //TAG.message = message
      //TAG.name = 'UserError';
      //TAG.code = code;
      //console.log(this.name, this.code)
      //this.CUT_TAG=TAG
     // This clips the constructor invocation from the stack trace.
     // It's not absolutely essential, but it does make the stack trace a little nicer.
     //  @see Node.js reference (bottom)
     Error.captureStackTrace(this, this.constructor);
     //console.log(captureStackTrace(this, this.constructor))
    }
  }

module.exports.UserError = UserError