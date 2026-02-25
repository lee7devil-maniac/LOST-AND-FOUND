const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const cleanDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for cleaning...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        const userColl = collections.find(c => c.name === 'users');
        if (userColl) {
            console.log('Dropping users collection to clear stale indexes and required fields...');
            await mongoose.connection.db.dropCollection('users');
            console.log('Users collection dropped.');
        } else {
            console.log('Users collection not found.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanDB();
