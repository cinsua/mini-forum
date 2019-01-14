const { newError } = require('../utils/customErrors')

module.exports = {
  async like(doc, user) {
    if (doc.likes.indexOf(user.id) > -1)
      throw newError('THREAD_ALREADY_LIKED')

    doc.likes.push(user.id)
    await doc.save()
    return doc

  },

  async unlike(doc, user) {
    if (doc.likes.indexOf(user.id) < 0)
      throw newError('THREAD_NOT_LIKED')

    doc.likes.remove(user.id)
    await doc.save()
    return doc
  },
}