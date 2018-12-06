const { User } = require('./users');
//const validator     = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    getUserFromBody: async (body) =>{
        const { name, password } = req.body;
        return { name, password };
    }

}