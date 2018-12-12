const passport = require('passport');
const User = require('../models/users');
const CONFIG = require('../../config/config')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')

const AuthError = require('../utils/customErrors').AuthError

module.exports = function () {
  passport.use(new BearerStrategy(verifyToken))
}

const verifyToken = async function (token, done) {
  //TODO if token has no "bearer " throws bad request.. we should intercept in somewhere
  jwt.verify(token, CONFIG.JWT.SECRET, async (err, decoded) => {

    if (err) {
      codes = {
        'jwt malformed': 'JWT_MF',
        'jwt signature is required': 'JWT_SR',
        'invalid signature': 'JWT_SI',
        'jwt expired': 'JWT_EXP',
        'invalid token': 'JWT_INV',
        'unexpected token': 'JWT_UNX'
      }
      msg = err.message
      //Unexpected or unexpected, lead to some errors, we group them
      if (msg.includes('nexpected')) msg = 'unexpected token'
      return done(new AuthError(msg, codes[msg]))
    }

    user = await User.findById(decoded.user_id);
    if (!user) {
      return done(new AuthError('User not found', 'USR_NOT_FOUND'))
    }

    return done(null, user)
  })
}