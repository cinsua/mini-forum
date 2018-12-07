const { ExtractJwt, Strategy } = require('passport-jwt');
const User      = require('../models/users');
const CONFIG = require('../config/config')

//strategy takes jwt, decrypt and get id from user. inyect in req as req.user
module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.JWT_SECRET;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        user= await User.findById(jwt_payload.user_id);
        //if(err) return done(err, false);
        if(user) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));
}