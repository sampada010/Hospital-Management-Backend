import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB')
    })

    await mongoose.connect(`${process.env.MONGO_URI || 'mongodb://mongo:27017'}/hospital`)
}

export default connectDB;