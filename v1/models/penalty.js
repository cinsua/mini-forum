const mongoose = require('mongoose')
const plugins = require('./plugins')

const Schema = mongoose.Schema

const penaltySchema = new Schema({
  reason: {
    type: 'String',
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    required: true,
    default() { return Date.now() + 60 * 1000 }
  },
  kind: {
    type: String,
    required: true,
    enum: ['ban', 'silence'],
    default: 'silence'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

},
plugins.generalOptions)

penaltySchema.plugin(plugins.generalPlugins)

penaltySchema.virtual('timePenalty').set(function (v) {
  this.expiresAt = Date.now() + v
})

penaltySchema.virtual('links').get(function () {
  let kindRoute, userid
  (this.kind === 'ban') ?
    kindRoute = 'bans' :
    kindRoute = 'silences'

  // if the penalty is populated, we take username, else we link the ugly id
  userid = this.user.username ?
    this.user.username :
    this.user

  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/users/${userid}/${kindRoute}/${this.id}`
  }
  return [self]
})

module.exports = mongoose.model('Penalty', penaltySchema)