const { ExtractJwt, Strategy } = require('passport-jwt');
const User      = require('../models/users');
const CONFIG = require('../config/config')

//strategy takes jwt, decrypt and get id from user. inyect in req as req.user
module.exports = function(passport){
    var opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    //console.log(opts.jwtFromRequest())
    opts.secretOrKey = CONFIG.JWT.SECRET;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        console.log('payload',jwt_payload)
        user= await User.findById(jwt_payload.user_id);
        if(user) {
            console.log('user')
            return done(null, user);
        }else{
            console.log('null false')
            return done(null, false);
        }
    }));
}