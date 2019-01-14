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

},
  plugins.generalOptions)
commentSchema.plugin(plugins.likes)
commentSchema.plugin(plugins.generalPlugins)

commentSchema.virtual('responses', {
  ref: 'Response', // The model to use
  localField: '_id',  // Find Penalties where `localField`
  foreignField: 'thread', // is equal to `foreignField`
  justOne: false, // gives us an array
})

commentSchema.virtual('links').get(function () {

  // BUG HERE: sometimes the link get all thread info
  //threadid = this.thread.id ?
  //  this.thread.id :
  //  this.thread

  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/threads/${this.thread}/${this._id}`
  }
  return [self]
})


module.exports = mongoose.model('Comment', commentSchema)