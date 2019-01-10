const Penalty = require('../models/penalty');
const { newError } = require('../utils/customErrors')
// TODO delete req dependency
module.exports = {

  create: async ({ reason, timePenalty, expirePenalty, user, author }, kind) => {
    //startTime = new Date();
    let penalty = new Penalty({ reason, kind, author, user })
    //endTime = new Date();
    //var timeDiff = endTime - startTime
    //console.log('PEN INSTANCE CREATION: ', timeDiff)

    if (timePenalty) penalty.timePenalty = timePenalty
    if (expirePenalty) penalty.expiresAt = expirePenalty
    //console.log(penalty)

    //startTime = new Date();
    await penalty.save()
    //endTime = new Date();
    //var timeDiff = endTime - startTime
    //console.log('PEN SAVE: ', timeDiff)

    return penalty
  },

  getBans: async (user) => {
    bans = await Penalty.find({ user: user.id, kind: 'ban' }).populate('author')

    return bans
  },

  getBan: async (user, banId) => {
    ban = await Penalty.findById(banId)//.populate('author')
    if (!ban) throw newError('REQUEST_PENALTY_NOT_FOUND')

    return ban
  },

  getSilences: async (user) => {
    silences = await Penalty.find({ user: user.id, kind: 'silence' }).populate('author')
    return silences
  },

  getSilence: async (user, silenceId) => {
    silence = await Penalty.findById(silenceId)
    if (!silence) throw newError('REQUEST_PENALTY_NOT_FOUND')

    return silence
  },

  deletePenalty: async (penalty) => {
    penalty.delete()
  }
}