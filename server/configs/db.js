import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const mongodbUri = process.env.MONGODB_URI;
        
        if (!mongodbUri) {
            throw new Error('MONGODB_URI environment variable is not set. Please configure it in your environment.');
        }

        mongoose.connection.on('connected', () => console.log('MongoDB connection event: connected'));
        mongoose.connection.on('error', (err) => console.error('MongoDB connection event: error', err));
        mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

        // Connect with optimized settings
        await mongoose.connect(mongodbUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 2
        });
        
        console.log('mongoose.connect resolved: connected to MongoDB');
        console.log('Database connection pooling configured');
        
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        // Exit process if DB connection fails in production
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

export default connectDB;