import { Router } from 'express'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'

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

export default authRouter