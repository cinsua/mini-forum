const passport = require('passport');
const util = require('util');
const Strategy = require('passport-strategy');
const roles = require('../models/roles')

module.exports = function () {
  passport.use(new GuestStrategy(function (req, done) {
    //here we should make sure this is not a fail attempt:
    // not token in header.. not username/pw in body to accept
    user = { username: roles.guestName, role: roles.guestLevel}
    done(null, user)
  }
  ))
}

// Custom Strategy for Guests

function GuestStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('GuestStrategy requires a verify callback');
  }
  Strategy.call(this);
  this.name = 'guest';
  this._verify = verify;
}

util.inherits(GuestStrategy, Strategy);

GuestStrategy.prototype.authenticate = function (req, options) {
  var self = this;
  this._verify(req, function (err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  });
};