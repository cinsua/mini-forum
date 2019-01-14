const UserService = require('../services/user')
const PenaltyService = require('../services/penalty')

async function _getPenaltyFromUser(req, kind) {
  let user = await UserService.getByIdOrUsername(
    req.validRequest.params.id,
    req.credentials.readFields,
    req.validRequest.query
  )
  // todo check if penalty is from user
  let penaltyParams = kind === 'silence' ?
    { penaltyId: req.params.silenceId, kind: 'silence' } :
    { penaltyId: req.params.banId, kind: 'ban' }

  let penalty = await PenaltyService.getOneFromUser(user, penaltyParams)
  await PenaltyService.checkPenaltyBelongsToUser(user, penalty)
    
  return { penalty, user }
}

async function _createPenalty(req, kind) {
  let user = await UserService.getByIdOrUsername(
    req.validRequest.params.id,
    req.credentials.readFields,
    req.validRequest.query
  )
  const { timePenalty, expirePenalty, reason } = req.validRequest.body
  let pen = { reason, timePenalty, expirePenalty, user: user.id, author: req.user.id }

  return await PenaltyService.create(pen, kind)
}


module.exports = {

  // TODO FILTER / PAGINATION
  async getBans(req, res, next) {
    let user = await UserService.getByIdOrUsername(
      req.validRequest.params.id,
      req.credentials.readFields,
      req.validRequest.query
    )
    let bans = await PenaltyService.getAllFromUser(user, { kind: 'ban' })

    req.data = bans

    return next()
  },

  async banUser(req, res, next) {
    let ban = await _createPenalty(req, 'ban')

    req.data = ban

    return next()
  },

  // TODO FILTER / PAGINATION
  async getSilences(req, res, next) {
    let user = await UserService.getByIdOrUsername(
      req.validRequest.params.id,
      req.credentials.readFields,
      req.validRequest.query
    )
    let silences = await PenaltyService.getAllFromUser(user, { kind: 'silence' })

    req.data = silences

    return next()
  },

  async silenceUser(req, res, next) {

    let silence = await await _createPenalty(req, 'silence')

    req.data = silence
    return next()
  },

  async removeBan(req, res, next) {
    let { user, penalty } = await _getPenaltyFromUser(req, 'ban')

    await PenaltyService.deletePenalty(penalty)

    req.data = { message: `ban removed from [${user.username}]` }

    return next()
  },

  async removeSilence(req, res, next) {

    let { user, penalty } = await _getPenaltyFromUser(req, 'silence')

    await PenaltyService.deletePenalty(penalty)

    req.data = { message: `silence removed from [${user.username}]` }

    return next()
  }
}

