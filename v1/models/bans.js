const mongoose = require('mongoose');
const User = require('./user');

const Schema = mongoose.Schema;

const banSchema = new Schema({
  reason: {
    type: 'String',
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expireDate: {
    type: Date,
    required: true,
    default: function () { return Date.now() + 60 * 1000 }
  }

},
  {
    timestamps: true,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  });

banSchema.virtual('timeBanned').set(function (v) {
  this.expireDate = Date.now() + v
});

module.exports = mongoose.model('Ban', banSchema);