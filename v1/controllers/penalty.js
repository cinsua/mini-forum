const UserService = require('../services/user');
const PenaltyService = require('../services/penalty');
const { newError } = require('../utils/customErrors')
const hateoas = require('../services/hateoas')

module.exports = {
  // TODO FILTER
  getPenalties: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    penalties = await PenaltyService.getPenalties(user)
    req.data = { penalties, message: 'penalties' }

    return next()
  },

  // TODO FILTER
  getBans: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    bans = await PenaltyService.getBans(user)
    req.data = { bans, message: 'bans' }

    return next()
  },

  banUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const {timePenalty, expirePenalty, reason} = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user, author: req.user }
    
    ban = await PenaltyService.create(pen, 'ban')
    ban.populate('user').populate('author')
    //user = await Service.get(req)
    req.data = { ban }
    return next()
  },

  // TODO FILTER
  getSilences: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    bans = await PenaltyService.getSilences(user)
    req.data = { bans, message: 'silences' }

    return next()
  },

  silenceUser: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)
    const {timePenalty, expirePenalty, reason} = req.validRequest.body
    let pen = { reason, timePenalty, expirePenalty, user, author: req.user }

    silence = await PenaltyService.create(pen, 'silence')
    silence.populate('user').populate('author')

    req.data = { silence }
    return next()
  },

  removeBan: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    ban = await PenaltyService.getBan(user, req.params.banId)
    await PenaltyService.deletePenalty(ban)
    req.data = { user, message: 'ban removed' }
    return next()
  },

  removeSilence: async (req, res, next) => {
    const idOrUsername = req.validRequest.params.id
    const readFields = req.credentials.readFields
    const queryUrl = req.validRequest.query

    user = await UserService.getByIdOrUsername(idOrUsername, readFields, queryUrl)

    silence = await PenaltyService.getSilence(user, req.params.silenceId)
    await PenaltyService.deletePenalty(silence)
    req.data = { user, message: 'silence removed' }
    return next()
  }
}