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

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    let bans = await PenaltyService.getBans(user)

    req.data = hateoas.addLinks(bans, paginationInfo = undefined, req.credentials, req.app.routes)

    return next()
  },

  banUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const { timePenalty, expirePenalty, reason } = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user:user.id, author: req.user.id }

    let ban = await PenaltyService.create(pen, 'ban')

    req.data = hateoas.addLinks(ban, paginationInfo = undefined, req.credentials, req.app.routes)


    return next()
  },

  // TODO FILTER / PAGINATION
  getSilences: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    let silences = await PenaltyService.getSilences(user)

    req.data = hateoas.addLinks(silences, paginationInfo = undefined, req.credentials, req.app.routes)

    return next()
  },

  silenceUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const { timePenalty, expirePenalty, reason } = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user:user.id, author: req.user.id }

    let silence = await PenaltyService.create(pen, 'silence')

    req.data = hateoas.addLinks(silence, paginationInfo = undefined, req.credentials, req.app.routes)
    return next()
  },

  removeBan: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    let ban = await PenaltyService.getBan(user, req.params.banId)
    await PenaltyService.deletePenalty(ban)

    let data = { message: `ban removed from [${user.username}]` }
    req.data = hateoas.addLinks(data, paginationInfo = undefined, req.credentials, req.app.routes)

    return next()
  },

  removeSilence: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    let user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    let silence = await PenaltyService.getSilence(user, req.params.silenceId)
    await PenaltyService.deletePenalty(silence)

    let data = { message: `silence removed from [${user.username}]` }
    req.data = hateoas.addLinks(data, paginationInfo = undefined, req.credentials, req.app.routes)

    return next()
  }
}