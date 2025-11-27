import mongoose from "mongoose";
const connectDB = async()=>{
    try {

        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not set in environment');
        }

        mongoose.connection.on('connected', () => console.log('MongoDB connection event: connected'));
        mongoose.connection.on('error', (err) => console.error('MongoDB connection event: error', err));

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongoose.connect resolved: connected to MongoDB');
        
    } catch (error) {

        console.log(error.message);
        
    }
}

export default connectDB;