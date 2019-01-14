const { errors } = require('./detailErrors')

class _NormalError extends Error {
  constructor(code, nameError, message) {
    super(message)
    this.name = nameError
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
  getError() {
    return { code: this.code, name: this.name, message: this.message }
  }
}

module.exports = {

  newError(code) {
    let err = new _NormalError(code, errors[code].name, errors[code].message)
    return err
  },

  newErrorCustom(code, name, msg) {
    let err = new _NormalError(code, name, msg)
    return err
  },

}
