const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connection.on('error', err => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Mongoose reconnected');
        });

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Initial Connection Error: ${err.message}`);
    }
};

module.exports = connectDB;
