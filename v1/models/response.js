const mongoose = require('mongoose')
const plugins = require('./plugins')

const Schema = mongoose.Schema

const responseSchema = new Schema({

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  content: {
    type: 'String',
  },

},
plugins.generalOptions)

responseSchema.plugin(plugins.generalPlugins)
/*
responseSchema.virtual('links').get(function () {
  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/threads/${this.thread}/`
  }
  return [self]
})*/


module.exports = mongoose.model('Response', responseSchema)