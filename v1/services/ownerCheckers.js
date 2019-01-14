const Thread = require('../models/thread')
const Comment = require('../models/comment')
const utils = require('../utils/utils')
const { newError } = require('../utils/customErrors')

module.exports = {
  async user(req) {

    if (req.params.id === req.user.id || req.params.id === req.user.username)
      return true

    if (req.params.id === 'me') {
      if (!utils.arraysEqual(req.user.roles, ['guest'])) {
        req.params.id = req.user.id
        return true
      }
      else
        throw newError('LOGIN_REQUIRED')
    }
    return false
  },

  async thread(req) {
    return Thread.countDocuments({ author: req.user._id, _id: req.params.threadId })
  },

  async comment(req) {
    return Comment.countDocuments({ author: req.user._id, thread: req.params.threadId, _id: req.params.commentId })
  }
}