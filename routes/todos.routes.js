import { Router } from 'express'
import Todo from '../models/Todo.model.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const todosRouter = Router()

todosRouter.get('/', async (req, res) => {
    try {
        const todos = await Todo.find()
        return res.status(200).json(todos)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})


todosRouter.post('/', isAuthenticatedMiddleware, async (req, res) => {
    const payload = req.body

    try {
        const newTodo = await Todo.create(payload)
        return res.status(201).json(newTodo)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

todosRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedTodo = await Todo.findOneAndUpdate({_id: id}, payload, { new: true })
        return res.status(200).json(updatedTodo)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

todosRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Todo.findOneAndDelete({_id: id})
        return res.status(204).json()      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

export default todosRouter