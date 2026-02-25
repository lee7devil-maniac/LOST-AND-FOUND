const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// Enable CORS
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.startsWith('http://localhost:');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS Blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));

// Image upload route
const upload = require('./middleware/upload');
const cloudinary = require('./config/cloudinary');

app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'mcc_lost_found'
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            data: result.secure_url
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading to cloud storage'
        });
    }
});

app.post('/api/upload/multiple', upload.array('images', 5), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Please upload at least one file' });
    }

    try {
        const uploadPromises = req.files.map(async (file) => {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'mcc_lost_found'
            });

            // Delete local file
            fs.unlinkSync(file.path);

            return result.secure_url;
        });

        const urls = await Promise.all(uploadPromises);

        console.log(`Multiple images uploaded: ${urls.length} files`);
        res.status(200).json({
            success: true,
            data: urls
        });
    } catch (error) {
        console.error('Cloudinary Multiple Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading to cloud storage'
        });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('--- SYSTEM INITIALIZATION ---');
    console.log(`Server: Running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log('-----------------------------');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
