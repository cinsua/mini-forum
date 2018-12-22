module.exports = {
  Owner: async function (req, res, next) {

    req.owner = false

    if (req.params.id === req.user.id ||
      req.params.id === req.user.username) {

      req.owner = true

    }
    // users/me -> users/req.user.id (already auth)
    if (req.params.id === 'me') {
      if (!arraysEqual(req.user.roles, ['guest'])) {
        req.params.id = req.user.id
        req.owner = true
      } else {
        throw new Error('You must be logged in to access')
      }

    }
    return next()
  }
}


function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
  }

  return true;
}