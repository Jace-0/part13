const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { Session, User } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  // console.log('USER', user)

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  

  // create token
  const token = jwt.sign(userForToken, SECRET)

  // store session
  await Session.create({
    userId: user.id,
    token,
    active: true })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router


// controllers/logout.js
router.delete('/logout', async (req, res) => {
  try {
    const token = req.get('authorization')?.substring(7)
    console.log('token', token)
    
    // Deactivate the session
    await Session.update(
      { active: false },
      { 
        where: { 
          token,
          active: true 
        } 
      }
    )

    res.status(204).end()
  } catch(error) {
    res.status(400).json({ error: 'invalid token' })
  }
})
