const passport = require('passport')
const User = require('../models/user')
const CONFIG = require('../../config/config')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')
const { newError, newErrorCustom } = require('../utils/customErrors')

module.exports = function () {
  passport.use(new BearerStrategy(verifyToken))
}

const verifyToken = async function (token, done) {
  //TODO if token has no 'bearer ' throws bad request.. we should intercept in somewhere
  jwt.verify(token, CONFIG.JWT.SECRET, async (err, decoded) => {

    if (err) {
      let codes = {
        'jwt malformed': 'JWT_MF',
        'jwt signature is required': 'JWT_SR',
        'invalid signature': 'JWT_SI',
        'jwt expired': 'JWT_EXP',
        'invalid token': 'JWT_INV',
        'unexpected token': 'JWT_UNX'
      }
      let msg = err.message
      //Unexpected or unexpected, lead to some errors, we group them
      if (msg.includes('nexpected')) msg = 'unexpected token'
      return done(newErrorCustom(codes[msg], 'LoginError', msg))
    }

    let user = await User.findById(decoded.userId).populate('penalties')
    if (!user) {
      return done(newError('LOGIN_PW_UNAME_INVALID'))
    }

    if (user.banned) {
      return done(newError('LOGIN_USER_BANNED'))
    }

    return done(null, user)
  })
}