const router = require('express').Router()
const { Op } = require('sequelize')


const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude : ['userId']},

    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)``
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read !== undefined){
    where.read = req.query.read === 'true'
  }


  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [{
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        as: 'readinglists',  // This will name the nested object as 'readinglists'
        attributes: ['id', 'read'],  // Only include these attributes
        where: where
      },

      // include: {
      //   model:ReadingList,
      //   attributes: { exclude: ['userId', 'blogId']}
      // }

    }]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})


router.put('/:username', async (req, res) => {
    const user = await User.findOne({ 
        where: { username: req.params.username } 
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update username
      user.username = req.body.username;

      try {
        await user.save();
        res.json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
  })

module.exports = router