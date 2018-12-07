const User = require('../models/users');

module.exports = {

    createUser: async (req, res, next) => {
        const { name, password } = req.body
        const user = new User({name, password })
        
        await user.save()
        req.status =201 // see http standar
        req.data={message: 'User Created',user: user.toWeb(), token: user.getJWT()}
        next()
    },

    getMe: async (req, res, next) => {

        let user = req.user
        req.status =201
        req.data={user: user.toWeb(), message: 'You are logged in'}
        next()
    },

    login: async (req, res, next) => {
        const { name, password } = req.body
        //throw errors in undefined
        let user = await User.findOne({name});
        if(!user) throw Error('name/password invalid');

        access = await user.comparePassword(password);
        if(!access) throw Error('name/password invalid');

        req.data={token: user.getJWT(), user: user.toWeb(), message: `Welcome ${name}`}
        //return ReS(res, {token:user.getJWT(), user:user.toWeb()});
        next()
    }
    
}