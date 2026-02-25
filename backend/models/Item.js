const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Electronics', 'Books', 'Clothing', 'Keys', 'Wallets', 'ID Cards', 'Other']
    },
    imageUrl: {
        type: String
    },
    images: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        required: [true, 'Please provide the location where it was found/lost']
    },
    type: {
        type: String,
        required: [true, 'Please specify if it is Lost or Found'],
        enum: ['lost', 'found']
    },
    status: {
        type: String,
        enum: ['active', 'claimed', 'resolved'],
        default: 'active'
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dateReported: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
