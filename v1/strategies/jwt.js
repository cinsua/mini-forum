const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const User      = require('../models/users');
const CONFIG = require('../../config/config')

module.exports = function(){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.JWT.SECRET;

    passport.use(new Strategy(opts, async function(jwt_payload, done){

        user= await User.findById(jwt_payload.user_id);
        if(user) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));
}