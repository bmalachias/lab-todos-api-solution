import { Router } from 'express'
import Todo from '../models/Todo.model.js'
import User from '../models/User.model.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const todosRouter = Router()

todosRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user.id})
        return res.status(200).json(todos)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})


todosRouter.post('/', isAuthenticatedMiddleware, async (req, res) => {
    //Adicionamos ao payload o id do usuário que vem do req.user gerado no middleware de autenticação
    const payload = { ...req.body, user: req.user.id }

    try {
        const newTodo = await Todo.create(payload)

        //Atualizar o usuário dono do todo para incluir o id do todo criado
        //Achar o usuário
        //Atualizar o usuário
        ////Inserir o id do novo todo
        await User.findOneAndUpdate({_id: req.user.id}, {$push: {todos: newTodo._id }})

        return res.status(201).json(newTodo)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

todosRouter.put('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            {_id: id, user: req.user.id}, 
            payload, 
            { new: true }
        )
        return res.status(200).json(updatedTodo)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

todosRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Todo.findOneAndDelete({_id: id, user: req.user.id})
        return res.status(204).json()      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

export default todosRouter