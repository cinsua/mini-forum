const Penalty = require('../models/penalties');

module.exports = {

  create: async (req, user, kind) => {
    const { reason, timePenalty, expirePenalty } = req.body
    let penalty = new Penalty({ reason, kind, author: req.user, user })
    if (timePenalty) penalty.timePenalty = timePenalty
    if (expirePenalty) penalty.expiresAt = expirePenalty

    penalty.save()
    return penalty
  },
}