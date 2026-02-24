const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: true
    },
    claimant: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please provide details to prove this item belongs to you']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    messageFromOwner: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
