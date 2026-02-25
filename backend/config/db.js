const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('CRITICAL: MONGO_URI is not defined in environment variables');
            return;
        }

        // Mask credentials for safe logging
        const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
        console.log(`Attempting to connect to MongoDB: ${maskedUri}`);

        mongoose.connection.on('error', err => {
            console.error('Mongoose connection error:', err);
        });

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false, // Fail fast if not connected
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Initial Connection Error: ${err.message}`);
    }
};

module.exports = connectDB;
