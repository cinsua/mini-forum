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

    //TODO check !user
    user = await User.findById(decoded.user_id);

    return done(null, user)
  })
}


/*
//How to use passport-JWT
//const { ExtractJwt, Strategy } = require('passport-jwt');
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = CONFIG.JWT.SECRET;

passport.use(new Strategy(opts, async function(jwt_payload, done){

  user= await User.findById(jwt_payload.user_id);

  if(user) {
    //throw new UnauthorizedError('mensaje','UA01')
    //return done(null, user);
    return done(new AuthError('mensaje','UA01'), user);
  }else{
    return done(null, false);
  }
}));
*/