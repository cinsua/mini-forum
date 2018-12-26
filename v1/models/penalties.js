const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
var mongoosePaginate = require('mongoose-paginate');
let mongooseHidden = require('mongoose-hidden')()

const Schema = mongoose.Schema;

const penaltySchema = new Schema({
  reason: {
    type: 'String',
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function () { return Date.now() + 60 * 1000 }
  },
  kind: {
    type: String,
    required: true,
    enum: ['ban', 'silence'],
    default: 'silence'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

},
  {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: true },
    toJSON: { getters: true, setters: true, virtuals: true },
    runSettersOnQuery: true
  });

penaltySchema.plugin(mongooseHidden)//, { hidden: { _id: false } })
penaltySchema.plugin(mongoosePaginate);
penaltySchema.plugin(mongoose_delete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' });

penaltySchema.virtual('timePenalty').set(function (v) {
  this.expiresAt = Date.now() + v
});
/*
penaltySchema.virtual('links').get(function () {
  //this.populate('user')
  (this.kind == 'ban' ) ?
    kind = 'bans' : kind = 'silences'
  self = {type: 'GET', rel: 'self',
          href: `/api/v1/users/${this.user}/penalties/${kind}/${this.id}`}
  return [self]
})
*/
module.exports = mongoose.model('Penalty', penaltySchema);