const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: 'String',
    required: true,
    trim: true
  }
});

// encrypt password before save
userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
    next();
  }
  let salt = bcrypt.genSaltSync(stage.saltingRounds)
  let hash = bcrypt.hashSync(user.password, salt)    
  user.password = hash
  next()
});

module.exports = mongoose.model('User', userSchema);