const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading')
const Session = require('./userSession')

User.hasMany(Blog)
Blog.belongsTo(User)
// Blog.sync( { alter: true } )
// User.sync( { alter: true } )

// User and Blog many-to-many relationship through ReadingList
User.belongsToMany(Blog, { through: ReadingList, as: 'readings'})
Blog.belongsToMany(User, { through: ReadingList })


User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog, User, ReadingList, Session
}