import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Error in connecting datbase :`, error)
        process.exit(1); //Stop the server if connection fails
    }
}

export default connectDB;