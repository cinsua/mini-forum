const mongoose = require('mongoose');
const User = require('../models/users');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

async function bdConnect(connUri){

    mongoose.connect('mydomino', {useNewUrlParser: true}) //connUri
    
}
// See https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
module.exports = {
    add: async (req, res, next) => {

        await mongoose.connect(connUri, {useNewUrlParser: true})

        const { name, password } = req.body;
        const user = new User({name, password })
        
        await user.save()
        req.status =203 
        req.data={data: user, error: false}
        next()
    },
    getAll: async (req, res, next) => {
        await mongoose.connect(connUri, {useNewUrlParser: true})
        let result = await User.find();
        req.status =201
        req.data={data: result, error: false}
        //throw Error("access denied");
        next()
    },
    
}