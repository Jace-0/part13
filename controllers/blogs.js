const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')

const { sessionValidator } = require('../util/middleware.js')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    if (!req.blog) {
      return next(new Error('Blog not found'));
    }
    next();
  };

  router.get('/', async (req, res) => {
    const where = {};
    
    if (req.query.search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`  // Using iLike for case-insensitive search
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ];
    }

    try {
      const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
          model: User,
          attributes: ['name']
        },
        where,
        order: [['likes', 'DESC']]
        // removed 'through' as it's not needed in findAll
      });

      res.json(blogs);
    } catch (err) {
      console.error(err);  // Add logging for debugging
      res.status(500).json({ error: err.message });  // Better error handling
    }
});


  router.get('/authors', async (req, res) => {
    console.log('hi')
    try {
      const authorsStats = await Blog.findAll({
        attributes: [
          'userId',
          [sequelize.fn('COUNT', sequelize.col('blog.id')), 'articles'],
          [sequelize.fn('SUM', sequelize.col('blog.likes')), 'likes']
        ],
        group: ['userId', 'user.id'],
        include: [{
          model: User,
          attributes: ['name']
        }],
        order: [[sequelize.fn('SUM', sequelize.col('blog.likes')), 'DESC']]
      });
  
      const result = authorsStats.map(author => ({
        author: author.user.name,
        articles: author.get('articles'),
        likes: author.get('likes')
      }));
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

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

router.post('/', sessionValidator, async (req, res, next) => {
  try {  
    const note = await Blog.create({...req.body, userId: req.user.id})
    return res.json(note)

  } catch (error){
    res.status(401).json({ error: error})
  }
  // const note = Note.build(req.body)
  // await note.save()
})


router.put('/:id', sessionValidator,  blogFinder, async (req, res) => {
    if (!req.blog) {
      return res.status(404).send('Blog not found');
    }

    const { likes } = req.body;
    if (typeof likes !== 'number') {
      return res.status(400).send('Invalid likes value');
    }

    req.blog.likes = likes;

    await req.blog.save();

    res.json(req.blog);
});

router.delete('/', sessionValidator,  async (req, res) => {
        // const { id } = req.body

        const blog = await Blog.findByPk(req.body.id);
        console.log('blog', blog.toJSON())

        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        if (!req.user) {
            return res.status(404).send('Not Authorised');
        }

        if (!req.user.id === blog.userId){
          return res.status(404).send('Not Authorised');
        }
        await blog.destroy()

        res.status(200).json({ message: 'Note deleted successfully' })

});


module.exports = router