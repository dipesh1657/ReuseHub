const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

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

        res.json({
            msg: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                address: user.address,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;