const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CONFIG = require('../../config/config')
const UserError = require('../utils/customErrors').UserError
const roles = require('./roles');
const Penalty = require('./penalties');

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
  roles: [String]
  ,
  /*
  bans: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Ban' }]
  */
  //penalties: [Penalty.schema]
},
  {
    timestamps: true,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  });

userSchema.virtual('penalties', {
  ref: 'Penalty', // The model to use
  localField:'_id', //'_id', // Find Penalties where `localField`
  foreignField: 'user', //'user', // is equal to `foreignField`
  justOne: false, // gives us an array
});

userSchema.virtual('banned').get(function () {
  this.populate('penalties')//.execPopulate()
  if (!this.penalties) return undefined
  if (this.penalties.length === 0) return undefined

  // get an array of dates of bans
  let datesBan = this.penalties
    .map(ban => (ban.kind === 'ban') ? ban.expiresAt : undefined)
    .filter(date => date)
  let lastBan = Math.max.apply(null, datesBan)
  if (lastBan > Date.now()) return new Date(lastBan)// .toUTCString()

  // can be omitted, keep for sanity
  return undefined
});

userSchema.virtual('silenced').get(async function () {
  await this.populate('penalties').execPopulate()
  if (!this.penalties) return undefined
  if (this.penalties.length === 0) return undefined

  // get an array of dates of silences
  let datesSilences = this.penalties
    .map(silence => (silence.kind === 'silence') ? silence.expiresAt : undefined)
    .filter(date => date)
  let lastSilence = Math.max.apply(null, datesSilences);

  if (lastSilence > Date.now()) return new Date(lastSilence)// .toUTCString()

  // can be omitted, keep for sanity
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

  return next()
});

userSchema.methods.comparePassword = async function (pw) {
  let err, pass;
  if (!this.password) throw new UserError('No Password was provided', 'PW_NF');

  pass = await bcrypt.compare(pw, this.password);
  return pass
}

userSchema.methods.getJWT = function () {
  // TODO
  // let expiration_time = parseInt(CONFIG.jwt_expiration);
  return "Bearer " + jwt.sign({ user_id: this._id }, CONFIG.JWT.SECRET, { expiresIn: 10000 });
};

userSchema.methods.toWeb = async function (role = 'admin') {
  role = 'admin'
  //penalties = await Penalty.find({'user': this._id}) //'user._id': this._id
  //console.log(penalties)

  //us = User.find({}).populate('penalties')

  //this.populate('penalties')//.execPopulate()
  let json = this.toJSON();
  json.id = this._id;// this is for the front end
  delete json.password; // i dont wanna send hash pwd
  delete json._id; // already sent in id
  delete json.__v // front dont need it
  if (role === 'user' || role === 'guest') {
    delete json.penalties
    delete json.updatedAt
  }
  return json;
};

// Simple validations. TODO
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