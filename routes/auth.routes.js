import { Router } from 'express'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const authRouter = Router()

authRouter.post('/auth/sign-up', async (req, res) => {
    const { name, email, password } = req.body

    try {
        const userExists = await User.findOne({email})
        if(userExists) {
            throw new Error('User exists')
        }
        const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS)
        const passwordHash = bcrypt.hashSync(password, salt)

        const newUser = await User.create({name, email, passwordHash})

        return res.status(201).json({name: newUser.name, email: newUser.email})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }

})

authRouter.post('/auth/login', async (req, res) => {
    //Recebo email e password do body json
    const { email, password } = req.body

    try {
        //tento achar o usuário no BD
        const user = await User.findOne({email})
        //Se o usuário não existe, lanço um erro
        if(!user) {
            throw new Error('User not found')
        }

        //Comparo a senha informada com o hash registrado no BD
        const comparePassword = bcrypt.compareSync(password, user.passwordHash)

        //Se a comparação falhar, lanço um erro
        if(!comparePassword) {
            throw new Error ('Password incorrect')
        }

        //Obtem o valor do secret e data de expiração
        const secret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRES

        //gera um jwt
        const token = jwt.sign({id: user._id, email: user.email}, secret, {expiresIn})

        //retorna o jwt para o cliente 
        return res.status(200).json({logged: true, jwt: token})

    } catch (error) {
        //se acontecer um erro, loga o erro e retorna 401
        console.log(error)
        return res.status(401).json({message: 'Unauthorized'})
    }
})

export default authRouter