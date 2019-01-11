const UserService = require('../services/user');
const PenaltyService = require('../services/penalty');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')

module.exports = {

  // TODO FILTER / PAGINATION
  getBans: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    bans = await PenaltyService.getBans(user)

    req.data = hateoas.addLinks(bans, undefined, req.credentials, req.app.routes)

    return next()
  },

  banUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const { timePenalty, expirePenalty, reason } = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user:user.id, author: req.user.id }

    ban = await PenaltyService.create(pen, 'ban')

    req.data = hateoas.addLinks(ban, undefined, req.credentials, req.app.routes)


    return next()
  },

  // TODO FILTER / PAGINATION
  getSilences: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    silences = await PenaltyService.getSilences(user)

    req.data = hateoas.addLinks(silences, undefined, req.credentials, req.app.routes)

    return next()
  },

  silenceUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const { timePenalty, expirePenalty, reason } = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user:user.id, author: req.user.id }

    silence = await PenaltyService.create(pen, 'silence')

    req.data = hateoas.addLinks(silence, undefined, req.credentials, req.app.routes)
    return next()
  },

  removeBan: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    ban = await PenaltyService.getBan(user, req.params.banId)
    await PenaltyService.deletePenalty(ban)

    data = { message: `ban removed from [${user.username}]` }
    req.data = hateoas.addLinks(data, undefined, req.credentials, req.app.routes)

    return next()
  },

  removeSilence: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    silence = await PenaltyService.getSilence(user, req.params.silenceId)
    await PenaltyService.deletePenalty(silence)

    data = { message: `silence removed from [${user.username}]` }
    req.data = hateoas.addLinks(data, undefined, req.credentials, req.app.routes)

    return next()
  }
}