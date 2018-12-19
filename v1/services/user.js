const User = require('../models/user');
const Penalty = require('../models/penalties');
var ObjectId = require('mongoose').Types.ObjectId

module.exports = {

  create: async (body) => {
    const { username, password } = body
    const user = new User({ username, password })
    await user.save()
    return user
  },

  getMe: async (body) => {
    const { username } = body
    let user = await User.findOne({ username });
    return user
  },

  deleteMe: async (req) => {
    const { user } = req
    await user.delete()
    return
  },

  updateMe: async (req) => {
    let user, data
    user = req.user;
    data = req.body;
    user.set(data);
    user = await user.save();
    return user
  },

  get: async (req) => {
    //const id
    const { username } = req.body
    req.params.id ? id = req.params.id : { id } = req.body

    user = await User.findOne({ username: id })
    if (user) return user

    if (id) {
      try {
        idValid = new ObjectId(id)
      } catch (e) {
        idValid = undefined
      }

      if (id != idValid) id = undefined
    }

    id ?
      user = await User.findById(id) :
      user = await User.findOne({ username })

    return user
  },

  getAll: async (req) => {
    users = await User.find({}).populate('penalties')
    return users

  },

  update: async (user, updObj) => {
    user.set(updObj)
    user = await user.save();
    return user
  },

  addPenalty: async (user, penalty) => {
    user.penalties.push(penalty)
    user.save()
  }

}