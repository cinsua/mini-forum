const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CONFIG = require('../../config/config')
const UserError = require('../utils/customErrors').UserError
const roles = require('./roles');
const Ban = require('./bans');



// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: 'String',
    required: true,
    trim: true
  },
  role: {
    type: 'String',
    required: true,
    trim: true,
    enum: Object.keys(roles.levels),
    default: roles.default
  },
  /*
  bans: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Ban' }]
  */
  bans: [Ban.schema]
},
{timestamps: true, 
toObject: {getters: true, setters: true}, 
toJSON: {getters: true, setters: true}, 
runSettersOnQuery: true});

userSchema.virtual('isBanned').get(function () {
  if (this.bans.length === 0) return undefined
  /*
  let activeBans = this.bans.filter(ban => ban.active)
  console.log(activeBans)
  if (activeBans.length === 0) return false
  //let date = Math.max.apply(null, activeBans.expireDate);
  return true
  */
  //let activeBans = this.bans.filter(ban => ban.expireDate > Date.now())
  //console.log(activeBans)
  let datesBan = this.bans.map(ban => ban.expireDate)
  let dateBan = Math.max.apply(null, datesBan);
  console.log(dateBan)
  if (dateBan > Date.now()) return new Date(dateBan)//.toUTCString()
  return undefined

});

// encrypt password before save
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) { // don't rehash if it's same password
    return next(); 
  }

  let pwHashed = await bcrypt.hash(user.password, CONFIG.JWT.SALTING_ROUNDS)
  user.password = pwHashed
  //validations with trow custom errors
  return next()
});

userSchema.methods.comparePassword = async function (pw) {
  let err, pass;
  if (!this.password) throw new UserError('No Password was provided', 'PW_NF');

  pass = await bcrypt.compare(pw, this.password);
  //if(!pass) throw new Error('mono no da la contra');
  return pass
}

userSchema.methods.getJWT = function () {
  //let expiration_time = parseInt(CONFIG.jwt_expiration);
  //see middleware/passport to change secret and expire
  return "Bearer " + jwt.sign({ user_id: this._id }, CONFIG.JWT.SECRET, { expiresIn: 10000 });
};

userSchema.methods.toWeb = function () {
  let json = this.toJSON();
  json.id = this._id;//this is for the front end
  delete json.password; // i dont wanna send hash pwd
  delete json._id; // already sent in id
  delete json.__v // front dont need it
  return json;
};

userSchema.path('password').validate(function (v) {
  if (v.length < 4) {
    let trueError = new UserError('Password require at least 4 characters', 'PW_SHORT')
    throw new Error(JSON.stringify(trueError))
  }
  return true;
})

userSchema.path('username').validate(function (v) {
  if (v.length < 4) {
    let trueError = new UserError('Username require at least 4 characters', 'USRNM_SHORT')
    throw new Error(JSON.stringify(trueError))
  }
  return true;
})


module.exports = mongoose.model('User', userSchema);