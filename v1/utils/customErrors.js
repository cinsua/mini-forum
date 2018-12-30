const { errors } = require('./detailErrors')

/*
// deprecated!! joi req validation avoid this
Mongoose caught every error in validation, drop him, and keep only the message.
Therefore generate another ValidationError and join text explaining which field was afected alongside original message.

Then what we do to keep our code/msg/name is put them in a json with a TAG inside the message.
when error is caught in middleware for handler errors, the message is depured and restored
usigin CUT_TAG as a filter
Of course, we can just filter looking for '{' and '}' directly, but is generic and in future releases we will dont
know if the message compose format changes
*/
class _CustomErrorMongoose extends Error {
  constructor(code, nameError, message) {
    super(message);
    //this.name = nameError
    //this.code = code
    let TAG = {}
    TAG.name = nameError;
    TAG.code = code;
    TAG.message = message
    this.CUT_TAG = TAG
    Error.captureStackTrace(this, this.constructor);
  }
}


class _NormalError extends Error {
  constructor(code, nameError, message) {
    super(message);
    this.name = nameError
    this.code = code
    Error.captureStackTrace(this, this.constructor);
  }
  getError() {
    return { code: this.code, name: this.name, message: this.message }
  }
}

module.exports = {
  newError: function (code) {
    err = new _NormalError(code, errors[code].name, errors[code].message)
    return err
  },
  newErrorCustom: function (code, name, msg) {
    err = new _NormalError(code, name, msg)
    return err
  },

  newMongooseError: function (code) {
    err = new _CustomErrorMongoose(code, errors[code].name, errors[code].message)
    return new Error(JSON.stringify(err))
  }
}
