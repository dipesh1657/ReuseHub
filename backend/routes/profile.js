const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({
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