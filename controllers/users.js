const mongoose = require('mongoose');
const User = require('../models/users');
/*
const connUri = process.env.MONGO_LOCAL_CONN_URL;

async function bdConnect(connUri){

    mongoose.connect('mydomino', {useNewUrlParser: true}) //connUri
    
}*/
// See https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
module.exports = {

    add: async (req, res, next) => {
        const { name, password } = req.body;
        const user = new User({name, password })
        
        await user.save()
        req.status =201
        req.data={data: user.toWeb(), error: false, token:user.getJWT()}
        next()
    },

    getMe: async (req, res, next) => {

        let user = req.user;
        req.status =201
        req.data={data: user.toWeb(), error: false, msg: 'You are logged in'}
        next()
    },
    
}