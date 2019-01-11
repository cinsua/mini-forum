const Penalty = require('../models/penalty')
const { newError } = require('../utils/customErrors')
// TODO delete req dependency
module.exports = {

  async create({ reason, timePenalty, expirePenalty, user, author }, kind) {

    let penalty = new Penalty({ reason, kind, author, user })

    if (timePenalty) penalty.timePenalty = timePenalty
    if (expirePenalty) penalty.expiresAt = expirePenalty

    await penalty.save()

    return penalty
  },

  async getBans(user) {
    let bans = await Penalty.find({ user: user.id, kind: 'ban' }).populate('author')

    return bans
  },

  async getBan(user, banId) {
    let ban = await Penalty.findById(banId)//.populate('author')
    if (!ban) throw newError('REQUEST_PENALTY_NOT_FOUND')

    return ban
  },

  async getSilences(user) {
    let silences = await Penalty.find({ user: user.id, kind: 'silence' }).populate('author')
    return silences
  },

  async getSilence(user, silenceId) {
    let silence = await Penalty.findById(silenceId)
    if (!silence) throw newError('REQUEST_PENALTY_NOT_FOUND')

    return silence
  },

  async deletePenalty(penalty) {
    penalty.delete()
  }
}