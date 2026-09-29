const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

function createToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

function userResponse(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        address: user.address,
        createdAt: user.createdAt
    };
}

function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    });
}

router.post('/signup', async (req, res) => {
    try {
        const { name, email, username, password, address } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, username, password: hashedPassword, address });
        await user.save();

        res.status(201).json({ msg: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = createToken(user);
        setAuthCookie(res, token);

        res.json({
            msg: 'Login successful',
            user: userResponse(user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ user: userResponse(user) });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    res.json({ msg: 'Logged out successfully' });
});

module.exports = router;
