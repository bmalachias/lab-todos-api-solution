import mongoose from 'mongoose'

const connectDb = async () => {
    const connection = await mongoose.connect('mongodb://localhost/todos-api-dev')
    console.log(`Connected to the database: ${connection.connections[0].name}`)
}

export default connectDb