const Penalty = require('../models/penalty')
const { newError } = require('../utils/customErrors')

module.exports = {

  async create({ reason, timePenalty, expirePenalty, user, author }, kind) {

    let penalty = new Penalty({ reason, kind, author, user })

    if (timePenalty) penalty.timePenalty = timePenalty
    if (expirePenalty) penalty.expiresAt = expirePenalty

    await penalty.save()

    return penalty
  },

  async getAllFromUser(user, { kind } = {}) {
    let penalties = await Penalty.find({ user: user.id, kind }).populate('author')
    return penalties
  },

  async getOneFromUser(user, { penaltyId, kind } = {}) {
    return await Penalty.findOne({ user: user.id, kind, _id: penaltyId }).populate('author')
  },

  async deletePenalty(penalty) {
    penalty.delete()
  },

  async checkPenaltyBelongsToUser(user, penalty) {
    if (!penalty.user.equals(user._id))
      throw newError('REQUEST_PENALTY_HAS_DIFFERENT_USER')
  },
}