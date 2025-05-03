import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/parking-spots';

// Connect to MongoDB
export const connectDB = mongoose.connect(mongoURI) .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Export the connection (optional)
