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

module.exports = mongoose.model('Response', responseSchema)