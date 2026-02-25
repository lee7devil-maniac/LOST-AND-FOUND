const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const promoteAdmin = async (username) => {
    try {
        if (!username) {
            console.error('Please provide a username: node promote-admin.js YOUR_USERNAME');
            process.exit(1);
        }

        await connectDB();

        if (mongoose.connection.readyState !== 1) {
            console.error('Database connection failed. Check your MONGO_URI.');
            process.exit(1);
        }

        const user = await User.findOneAndUpdate(
            { username: username.toLowerCase() },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.error(`User "${username}" not found.`);
            process.exit(1);
        }

        console.log(`SUCCESS: User "${user.username}" is now an ADMIN.`);
        process.exit(0);
    } catch (err) {
        console.error('Promotion failed:', err.message);
        process.exit(1);
    }
};

const targetUsername = process.argv[2];
promoteAdmin(targetUsername);
