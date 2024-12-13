const jwt = require('jsonwebtoken')
const { Session, User } = require('../models')
const sessionValidator = async (req, res, next) => {
    try {
      const token = req.get('authorization')?.substring(7)
      
      // First verify token structure
      const decodedToken = jwt.verify(token, process.env.SECRET)
  
      // Check if session exists and is active
      const session = await Session.findOne({
        where: {
          token,
          active: true
        },
        include: {
          model: User,
          attributes: ['disabled']
        }
      })
  
      // Check session validity and user status
      if (!session || session.user.disabled) {
        return res.status(401).json({ error: 'token invalid or user disabled' })
      }
  
      req.user = await User.findByPk(decodedToken.id)
      next()
    } catch(error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  }

module.exports = {sessionValidator}