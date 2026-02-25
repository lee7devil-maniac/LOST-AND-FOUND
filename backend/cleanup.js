const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Item = require('./models/Item');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const cleanup = async () => {
    try {
        await connectDB();

        // 1. Find the target user
        const targetUser = await User.findOne({ username: 'kaaviyan2' });

        if (!targetUser) {
            console.error('User "kaaviyan2" not found. Aborting cleanup to prevent accidental data loss.');
            process.exit(1);
        }

        console.log(`Found target user: ${targetUser.name} (${targetUser._id})`);

        // 2. Count items to be deleted
        const count = await Item.countDocuments({ postedBy: { $ne: targetUser._id } });
        console.log(`Found ${count} items not belonging to "kaaviyan2".`);

        if (count > 0) {
            // 3. Delete items
            const result = await Item.deleteMany({ postedBy: { $ne: targetUser._id } });
            console.log(`Successfully deleted ${result.deletedCount} test items.`);
        } else {
            console.log('No test items found to delete.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
};

cleanup();
