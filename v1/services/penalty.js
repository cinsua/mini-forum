const Penalty = require('../models/penalties');
const { newError } = require('../utils/customErrors')

module.exports = {

  create: async (req, user, kind) => {
    const { reason, timePenalty, expirePenalty } = req.body
    let penalty = new Penalty({ reason, kind, author: req.user, user })
    if (timePenalty) penalty.timePenalty = timePenalty
    if (expirePenalty) penalty.expiresAt = expirePenalty
    penalty.save()

    return penalty
  },

  getBans: async (user) => {
    bans = await Penalty.find({ user: user.id, kind: 'ban' }).populate('author')

    return bans
  },

  getBan: async (user, banId) => {
    ban = await Penalty.findById(banId)//.populate('author')
    if (!ban) throw newError(REQUEST_PENALTY_NOT_FOUND)

    return ban
  },

  getSilences: async (user) => {
    silences = await Penalty.find({ user: user.id, kind: 'silence' }).populate('author')
    return silences
  },

  getSilence: async (user, silenceId) => {
    silence = await Penalty.findById(silenceId)
    if (!silence) throw newError(REQUEST_PENALTY_NOT_FOUND)

    return silence
  },

  getPenalties: async (user) => {
    penalties = await Penalty.find({ user: user.id }).populate('author')

    return penalties
  },

  deletePenalty: async (penalty) => {
    penalty.delete()
  }
}