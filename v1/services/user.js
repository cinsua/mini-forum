const User = require('../models/user');
const Penalty = require('../models/penalties');
var ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  // TODO CHECK EMPTY ERRORS
  create: async ({ username, password }) => {
    //const { username, password } = body
    const user = new User({ username, password })
    user.roles.push('user')
    await user.save()
    return user
  },

  getAll: async (req) => {
    //TODO if query in url remove the rest
    fieldsToSelect = req.permissions.options.join(' ')
    query = getPaginateQueryUsers({}, req.permissions.options,req.query)

    // TODO (remove all populates basically that not included)
    usersAndMetaData = await query//find().populate('penalties')
        // output
    // "docs":[user]
    // "total": 2,
    // "limit": 12,
    // "page": 1,
    // "pages": 1
    
    //console.log(users.docs)
    users = usersAndMetaData.docs
    delete usersAndMetaData.docs
    metaData = usersAndMetaData
    users = cleanUsers(users, req.permissions.options)

    return users

  },

  getMe: async (body) => {
    const { username } = body
    let user = await User.findOne({ username });
    return user
  },

  deleteMe: async (req) => {
    const { user } = req
    await user.delete()
    return
  },

  updateMe: async (req) => {
    let user, data
    user = req.user;
    data = req.body;
    user.set(data);
    user = await user.save();
    return user
  },

  get: async (req) => {
    //const id
    const { username } = req.body
    req.params.id ? id = req.params.id : { id } = req.body

    user = await User.findOne({ username: id })
    if (user) return user

    if (id) {
      try {
        idValid = new ObjectId(id)
      } catch (e) {
        idValid = undefined
      }

      if (id != idValid) id = undefined
    }

    id ?
      user = await User.findById(id) :
      user = await User.findOne({ username })

    return user
  },

  

  update: async (user, updObj) => {
    user.set(updObj)
    user = await user.save();
    return user
  },

  addPenalty: async (user, penalty) => {
    user.penalties.push(penalty)
    user.save()
  }

}

async function getPaginateQueryUsers(user, options, queryUrl) {

  fieldsToSelect = options.join(' ')
  if (fieldsToSelect == 'all') fieldsToSelect = undefined
  let {page=1, limit=1} = queryUrl

  var optionss = {
    select: fieldsToSelect,
    sort: { createdAt: -1 },
    populate: 'penalties',
    // can be truth?
    leanWithId: false ,
    page: Number(page), 
    limit: Number(limit)
  };

  query = User.paginate(user,optionss)
  //console.log(query)

  return query
}

function cleanUsers(users, options) {

  // why i need this? check paginate, seems to no lean
  users = users.map((us)=>(us.toObject()))

  if (!options.includes('penalties')){
    console.log(options)
    //asd = users.map(({...tails}) => tails)
    //console.log(asd)

    users = users.map(({penalties, ...restOfUser }) => restOfUser)
    //users[0]['penalties'] = 'asd'
  }
  return users
}