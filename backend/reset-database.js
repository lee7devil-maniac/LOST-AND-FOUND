const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const factoryReset = async () => {
    try {
        console.log('--- FACTORY RESET INITIATED ---');
        await connectDB();

        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected. Please check your MONGO_URI.');
        }

        const collections = Object.keys(mongoose.connection.collections);

        for (const collectionName of collections) {
            console.log(`Dropping collection: ${collectionName}...`);
            await mongoose.connection.collections[collectionName].drop();
        }

        console.log('SUCCESS: All data wiped. The website is now "as new".');
        console.log('You can now register the first "admin" account.');
        process.exit(0);
    } catch (err) {
        if (err.message.includes('authentication failed')) {
            console.error('ERROR: Cannot reset. The database password is still wrong.');
        } else if (err.codeName === 'NamespaceNotFound') {
            console.log('Database is already empty.');
            process.exit(0);
        } else {
            console.error('Reset failed:', err.message);
        }
        process.exit(1);
    }
};

factoryReset();
