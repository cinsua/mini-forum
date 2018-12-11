const { ExtractJwt, Strategy } = require('passport-jwt');
const User      = require('../models/users');
const CONFIG = require('../config/config')
const LocalStrategy = require('passport-local');

//strategy takes jwt, decrypt and get id from user. inyect in req as req.user
module.exports = function(passport){
    var opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    //opts.jwtFromRequest = extract
    //console.log(opts.jwtFromRequest())
    opts.secretOrKey = CONFIG.JWT.SECRET;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        console.log('i get here anyways')

        user= await User.findById(jwt_payload.user_id);
        if(user) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));


    // SESSION FALSE NOT WORKING... PICH
    passport.use('Optional',new LocalStrategy({
        passReqToCallback: true,
        session: false,
      },
        function(req, username, password, done) {
          /*
            User.findOne({ username: username }, function (err, user) {
             if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
            
          });*/
          console.log('asdasd')
          user = {name:'Guest'}
          console.log(user)
          done(null, user)
          //next()

        }
      ));
}


//JUST FOR INFORMATION...
var extract = function (req){
    let a = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    if (a === null){
        //this means empty token
    }
    console.log('A: ', a)
    return 'mytoken'//ExtractJwt.fromAuthHeaderAsBearerToken();
}