const Penalty = require('../models/penalties');
const helper = require('../utils/adminChequers')

module.exports = {

  create: async (req, kind) => {
    const { reason, timePenalty, expirePenalty } = req.body
    let penalty = new Penalty({ reason, kind, author: req.user })
    if (timePenalty) penalty.timePenalty = timePenalty
    if (expirePenalty) penalty.expireDate = expirePenalty

    // dont save here. every penalty is attached to an user array of penalties
    return penalty
  },
}