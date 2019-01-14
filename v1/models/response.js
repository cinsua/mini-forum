const mongoose = require('mongoose')
const CONFIG = require('../../config/config')

// plugins
const mongooseDelete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate')
const mongooseHidden = require('mongoose-hidden')()

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
  {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: true },
    toJSON: { getters: true, setters: true, virtuals: true },
    runSettersOnQuery: true
  })

responseSchema.plugin(mongooseHidden)
responseSchema.plugin(mongoosePaginate)
responseSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' })

responseSchema.virtual('links').get(function () {
  let self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/threads/${this.thread}/`
  }
  return [self]
})


module.exports = mongoose.model('Response', responseSchema)