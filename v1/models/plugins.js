//const mongoose = require('mongoose')
// plugins
const mongooseDelete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const mongooseHidden = require('mongoose-hidden')()

module.exports = {
  generalOptions: {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: true },
    toJSON: { getters: true, setters: true, virtuals: true },
    runSettersOnQuery: true
  },

  generalPlugins(schema) {
    schema.plugin(mongooseHidden)
    schema.plugin(mongoosePaginate)
    schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' })
  },
}