import mongoose from 'mongoose';
import dotenv from "dotenv"


dotenv.config()

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; // Re-throw error to be caught in server.js
    }
};

export default connectDb;
