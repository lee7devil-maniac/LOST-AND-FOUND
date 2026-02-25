const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res) => {
    try {
        const secret = process.env.JWT_SECRET;
        const expire = process.env.JWT_EXPIRE || '30d';
        const cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10);

        if (!secret) {
            console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ success: false, message: 'Server configuration error (JWT)' });
        }

        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: expire
        });

        const options = {
            expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        if (process.env.NODE_ENV === 'production') {
            options.secure = true;
            options.sameSite = 'none'; // Required for cross-site cookies in some browsers
        }

        res.status(statusCode).cookie('token', token, options).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Token Response Error:', err);
        res.status(500).json({ success: false, message: 'Authentication failure during token generation' });
    }
};

exports.register = async (req, res, next) => {
    try {
        console.log('Incoming Register Request:', req.body);
        const { name, username, password } = req.body;
        const user = await User.create({ name, username, password });
        console.log('User created successfully:', user._id);
        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error('Registration Error:', err);
        if (typeof next === 'function') {
            next(err);
        } else {
            res.status(500).json({ success: false, message: 'Server synchronization error' });
        }
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const user = await User.findOne({ username }).select('+password');
        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
