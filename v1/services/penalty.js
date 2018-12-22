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
  getBans: async(user) => {
    bans = await Penalty.find({user: user.id, kind: 'ban'}).populate('author')
    console.log('bans[0].idee :', bans[0].idee);
    return bans
  },
  getBan: async(user, banId) => {
    ban = await Penalty.findById(banId)//.populate('author')
    console.log('ban', ban);
    return ban
  },
  getSilences: async(user) => {
    bans = await Penalty.find({user: user.id, kind: 'silence'}).populate('author')
    return bans
  },
  getSilence: async(user, silenceId) => {
    silence = await Penalty.findById(silenceId)//.populate('author')
    console.log('silence', silence);
    return silence
  },
  getPenalties: async(user) => {
    bans = await Penalty.find({user: user.id}).populate('author')
    return bans
  },
  deletePenalty: async(penalty) => {
    penalty.delete()
  }
}