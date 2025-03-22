import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Error in connecting datbase :`, error)
    }
}

export default connectDB;