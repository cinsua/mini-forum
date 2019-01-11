const Thread = require('../models/thread')
const User = require('../models/user')
const Comment = require('../models/comment')
const utils = require('../utils/utils')

module.exports = {
  async user(req) {
    owner = false

    if (req.params.id === req.user.id ||
      req.params.id === req.user.username) {
      owner = true
    }

    // users/me -> users/req.user.id (already auth)
    if (req.params.id === 'me') {
      if (!utils.arraysEqual(req.user.roles, ['guest'])) {
        req.params.id = req.user.id
        owner = true
      } else {
        throw newError('LOGIN_REQUIRED')
      }

    }
    return owner
  },

  async thread(req) {
    return Thread.countDocuments({ author: req.user._id, _id: req.params.threadId })
  },

  async comment(req) {
    return Comment.countDocuments({ author: req.user._id, thread: req.params.threadId, _id: req.params.commentId })
  }
}