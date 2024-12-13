const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const errorHandler = require('./middleware/errorHandler')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const readingListsRouter = require('./controllers/readingList')

app.use(express.json());

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/readinglists', readingListsRouter)
app.use(errorHandler);


// const main = async () => {
//     console.log('hello')
//     try{
//         await sequelize.authenticate()
//         const blogs = await sequelize.query('SELECT * FROM blogs', {type: QueryTypes.SELECT})
//         blogs.map(blog => console.log(`${blog.author}: '${blog.title},' ${blog.likes} likes`))
        
//     }catch (error) {
//         console.error('Unable to connect to the database', error)
//     }
// }


// main()



const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
  
  start()