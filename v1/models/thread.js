const mongoose = require('mongoose')
const plugins = require('./plugins')

const Schema = mongoose.Schema

const threadSchema = new Schema({
  title: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  private: {
    type: Boolean,
    default: false,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  content: {
    type: 'String',
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],

},
  plugins.generalOptions)

threadSchema.plugin(plugins.generalPlugins)

threadSchema.virtual('comments', {
  ref: 'Comment', // The model to use
  localField: '_id',  // Find Penalties where `localField`
  foreignField: 'thread', // is equal to `foreignField`
  justOne: false, // gives us an array
})

threadSchema.virtual('likesCounter').get(function () {

  if (this.likes) return this.likes.lenght
  return 0
})

threadSchema.virtual('links').get(function () {
  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/threads/${this._id}`
  }
  return [self]
})


module.exports = mongoose.model('Thread', threadSchema)