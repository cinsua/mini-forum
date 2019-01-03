const mongoose = require('mongoose');
const CONFIG = require('../../config/config')

// plugins
const mongoose_delete = require('mongoose-delete');
var mongoosePaginate = require('mongoose-paginate');
let mongooseHidden = require('mongoose-hidden')()

const Schema = mongoose.Schema;

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
  });

responseSchema.plugin(mongooseHidden)
responseSchema.plugin(mongoosePaginate);
responseSchema.plugin(mongoose_delete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' });

responseSchema.virtual('links').get(function () {
  self = {
    type: 'GET', rel: 'self',
    href: `/api/v1/threads/${this.thread}/`
  }
  return [self]
})


module.exports = mongoose.model('Response', responseSchema);