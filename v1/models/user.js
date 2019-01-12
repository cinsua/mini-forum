const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CONFIG = require('../../config/config')

// plugins
const mongooseDelete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const mongooseHidden = require('mongoose-hidden')()

const Schema = mongoose.Schema

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
    trim: true,
    hide: true
  },
  roles: [String],

},
  {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: true },
    toJSON: { getters: true, setters: true, virtuals: true },
    runSettersOnQuery: true
  })

userSchema.plugin(mongooseHidden)
userSchema.plugin(mongoosePaginate)
userSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' })
userSchema.virtual('penalties', {
  ref: 'Penalty', // The model to use
  localField: '_id',  // Find Penalties where `localField`
  foreignField: 'user', // is equal to `foreignField`
  justOne: false, // gives us an array
})

userSchema.virtual('banned').get(function () {
  if (!this.penalties) return
  if (this.penalties.length === 0) return

  // get an array of dates of bans
  let datesBan = this.penalties
    .filter((ban) => (ban.kind === 'ban'))
    .map((ban) => (ban.expiresAt))

  let lastBan = Math.max.apply(null, datesBan)

  if (lastBan > Date.now()) return new Date(lastBan)// .toUTCString()

  // can be omitted, keep for sanity
  return
})

userSchema.virtual('silenced').get(function () {
  if (!this.penalties) return
  if (this.penalties.length === 0) return

  // get an array of dates of silences
  let datesSilences = this.penalties
    .filter((silence) => (silence.kind === 'silence'))
    .map((silence) => (silence.expiresAt))
  let lastSilence = Math.max.apply(null, datesSilences)

  if (lastSilence > Date.now()) return new Date(lastSilence)// .toUTCString()
  
  // can be omitted, keep for sanity
  return
})

userSchema.virtual('links').get(function () {

  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/users/${this.username}`
  }
  return [self]
})

// encrypt password before save
userSchema.pre('save', async function (next) {
  const user = this

  // don't rehash if it's same password
  if (!user.isModified('password')) return next()

  user.password = await bcrypt.hash(user.password, CONFIG.JWT.SALTING_ROUNDS)

  return next()
})

userSchema.methods.comparePassword = async function (pw) {
  return await bcrypt.compare(pw, this.password)
}

userSchema.methods.getJWT = function () {
  // TODO
  // let expiration_time = parseInt(CONFIG.jwt_expiration)
  return 'Bearer ' + jwt.sign({ userId: this._id }, CONFIG.JWT.SECRET, { expiresIn: 10000 })
}

module.exports = mongoose.model('User', userSchema)