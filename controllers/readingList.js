// controllers/readinglists.js
const router = require('express').Router()
const { ReadingList } = require('../models')
const { sessionValidator } = require('../util/middleware')

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get('authorization')
//   console.log('auth', authorization)
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     try {
//       console.log(authorization.substring(7))
//       console.log(SECRET)
//       req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

//     } catch (error) {
//       console.log(error)
//       return res.status(401).json({ error: 'token invalid' })
//     }
//   } else {
//     return res.status(401).json({ error: 'token missing' })
//   }

//   next()
// } 

router.post('/', sessionValidator, async (req, res) => {
  const { userId, blogId } = req.body

  const readingList = await ReadingList.create({
    userId,
    blogId,
    read: false
  })

  res.json(readingList)
})


router.put('/:id', sessionValidator, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id)
  
  if (!readingList) {
    return res.status(404).json({ error: 'Reading list entry not found' })
  }

  // Check if the user owns this reading list entry
  if (readingList.userId !== req.user.id) {
    return res.status(403).json({ error: 'Can only mark own readings as read' })
  }

  // Validate the request body
  if (typeof req.body.read !== 'boolean') {
    return res.status(400).json({ error: 'Read status must be boolean' })
  }

  try {
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } catch(error) {
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

module.exports = router