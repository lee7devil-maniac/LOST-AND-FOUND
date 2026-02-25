const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
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

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set static folder EARLY with robust security headers for ORB/CORS
// This prevents other middleware or strict Helmet settings from blocking it
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Cache-Control', 'public, max-age=3600');
    }
}));

// Enable CORS - Early initialization
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.startsWith('http://localhost:');
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security headers - Optimized for ORB resolution
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Re-add body parser after static
app.use(express.json());
app.use(cookieParser());

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
        // Return only the filename - Frontend will prepend IMAGE_BASE_URL (/uploads/)
        const imageUrl = req.file.filename;

        res.status(200).json({
            success: true,
            data: imageUrl
        });
    } catch (error) {
        console.error('Local Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving image locally'
        });
    }
});

app.post('/api/upload/multiple', upload.array('images', 5), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Please upload at least one file' });
    }

    try {
        const urls = req.files.map(file => file.filename);

        console.log(`Multiple images uploaded locally: ${urls.length} files`);
        res.status(200).json({
            success: true,
            data: urls
        });
    } catch (error) {
        console.error('Local Multiple Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving images locally'
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
