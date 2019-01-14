const UserService = require('../services/user')
const PenaltyService = require('../services/penalty')

async function _getPenaltyFromUser(req, kind) {
  let user = await UserService.getByIdOrUsername(
    req.validRequest.params.id,
    req.credentials.readFields,
    req.validRequest.query
  )
  // todo check if penalty is from user
  let penalty = kind === 'silence' ?
    await PenaltyService.getSilence(user, req.params.silenceId) :
    await PenaltyService.getBan(user, req.params.banId)

  return { penalty, user }

}

module.exports = {

  // TODO FILTER / PAGINATION
  async getBans(req, res, next) {
    let user = await UserService.getByIdOrUsername(
      req.validRequest.params.id,
      req.credentials.readFields,
      req.validRequest.query
    )
    let bans = await PenaltyService.getBans(user)

    req.data = bans

    return next()
  },

  async banUser(req, res, next) {
    let user = await UserService.getByIdOrUsername(
      req.validRequest.params.id,
      req.credentials.readFields,
      req.validRequest.query
    )
    const { timePenalty, expirePenalty, reason } = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user: user.id, author: req.user.id }

    let ban = await PenaltyService.create(pen, 'ban')

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
    let silences = await PenaltyService.getSilences(user)

    req.data = silences

    return next()
  },

  async silenceUser(req, res, next) {
    let user = await UserService.getByIdOrUsername(
      req.validRequest.params.id,
      req.credentials.readFields,
      req.validRequest.query
    )
    const { timePenalty, expirePenalty, reason } = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user: user.id, author: req.user.id }

    let silence = await PenaltyService.create(pen, 'silence')

    req.data = silence
    return next()
  },

  async removeBan(req, res, next) {
    let { user, penalty } = await _getPenaltyFromUser(req, 'ban')
    let ban = penalty
    await PenaltyService.deletePenalty(ban)

    req.data = { message: `ban removed from [${user.username}]` }

    return next()
  },

  async removeSilence(req, res, next) {

    let { user, penalty } = await _getPenaltyFromUser(req, 'silence')
    let silence = penalty

    await PenaltyService.deletePenalty(silence)

    req.data = { message: `silence removed from [${user.username}]` }

    return next()
  }
}

