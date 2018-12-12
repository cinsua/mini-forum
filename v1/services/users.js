const User = require('../models/users');

module.exports = {
    create: async (body) =>{
        const { name, password } = body
        const user = new User({name, password })
        await user.save()
        return user
    },
    get: async (body) =>{
        const {name} = body
        let user = await User.findOne({name});
        return user
    },
    deleteMe: async (req) =>{
        const {user} = req
        //console.log(user)
        await user.remove()
        return
    },
    updateMe: async (req) =>{
        let user, data
        user = req.user;
        data = req.body;
        user.set(data);
        user = await user.save();
        return user
    }

}