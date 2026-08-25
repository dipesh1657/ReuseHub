const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Listing = require('../models/listing');

router.get('/all', async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'Active' }).sort({ createdAt: -1 });
        res.json({ listings });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/my/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const listings = await Listing.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json({ listings });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, title, price, description, type, category, condition, status, image } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const listing = new Listing({
            userId: user._id,
            title,
            price,
            description,
            type,
            category: category || 'other',
            condition: condition || 'good',
            status: status || 'Active',
            image: image || ''
        });

        await listing.save();
        res.status(201).json({ msg: 'Listing created', listing });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ msg: 'Listing not found' });
        }

        await listing.deleteOne();
        res.json({ msg: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;