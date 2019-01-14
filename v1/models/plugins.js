const mongoose = require('mongoose')
const Schema = mongoose.Schema
// plugins
const mongooseDelete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const mongooseHidden = require('mongoose-hidden')()

module.exports = {

  generalOptions: {
    timestamps: true,
    toObject: { virtuals: true, getters: true, setters: true },// 
    //toJSON: { getters: true, setters: true, virtuals: true },
    //runSettersOnQuery: true
  },

  generalPlugins(schema) {
    schema.plugin(mongooseHidden)
    schema.plugin(mongoosePaginate)
    schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' })
  },

  likes(schema) {
    schema.add({
      likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }]
    })

    schema.virtual('likesCounter').get(function () {
      if (this.likes)
        return this.likes.length
    })
  },

}