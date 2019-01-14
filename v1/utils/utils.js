
module.exports = {

  removeNullsNested(obj) {
    Object.entries(obj).forEach(([key, val]) => {
      if (val && typeof val === 'object') module.exports.removeNullsNested(val)
      else if (val == null) delete obj[key]
    })
  },

  cleanDocument(doc) {
    if (doc.toObject)
      doc = doc.toObject()
    module.exports.removeNullsNested(doc)
    return doc
  },

  cleanDocuments(docs) {
    docs = docs.map((doc) => (module.exports.cleanDocument(doc)))
    return docs
  },

  cleanResult(docs) {
    if (Array.isArray(docs))
      return module.exports.cleanDocuments(docs)
    else if (Object.prototype.toString.call(docs) === '[object String]')
      return docs
    else return module.exports.cleanDocument(docs)
  },

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false
    for (let i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i])
        return false
    }
    return true
  }

}