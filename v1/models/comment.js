const mongoose = require('mongoose')
const plugins = require('./plugins')
const Schema = mongoose.Schema

const commentSchema = new Schema({

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Thread',
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

commentSchema.plugin(plugins.generalPlugins)

commentSchema.virtual('responses', {
  ref: 'Response', // The model to use
  localField: '_id',  // Find Penalties where `localField`
  foreignField: 'thread', // is equal to `foreignField`
  justOne: false, // gives us an array
})

commentSchema.virtual('likesCounter').get(function () {
  //if (!this.likes) return undefined
  //if (this.likes.length === 0) return undefined
  //return this.likes.lenght
  if (this.likes) return this.likes.lenght

  return 0
})

commentSchema.virtual('links').get(function () {
  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/threads/${this.thread}/`
  }
  return [self]
})


module.exports = mongoose.model('Comment', commentSchema)