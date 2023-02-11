import express from 'express'
import cors from 'cors'
import connectDb from './config/db.connection.js'
import todosRouter from './routes/todos.routes.js'
import authRouter from './routes/auth.routes.js'

const app = express()
connectDb()

app.use(cors())
app.use(express.json())
app.use('/todos', todosRouter)
app.use(authRouter)

app.listen(3001, () => console.log('Server listening on port ', 3001))