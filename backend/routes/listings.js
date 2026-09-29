const express = require('express');
const multer = require('multer');
const router = express.Router();
const Listing = require('../models/listing');
const authMiddleware = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    }
});

function uploadToCloudinary(fileBuffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'reusehub/listings', resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
}

router.use(authMiddleware);

router.get('/all', async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate('userId', 'name username address')
            .sort({ createdAt: -1 });
        res.json({ listings });
    } catch (error) {
        console.error('Get listings error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/my', async (req, res) => {
    try {
        const listings = await Listing.find({ userId: req.user.id })
            .populate('userId', 'name username address')
            .sort({ createdAt: -1 });
        res.json({ listings });
    } catch (error) {
        console.error('Get my listings error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findOne({ _id: req.params.id })
            .populate('userId', 'name username address');

        if (!listing) return res.status(404).json({ msg: 'Listing not found' });
        res.json({ listing });
    } catch (error) {
        console.error('Get listing error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, type, category, condition, location } = req.body;

        if (!title || !price || !description || !type || !location) {
            return res.status(400).json({ msg: 'Title, price, description, type and location are required' });
        }

        let image = '';
        if (req.file) image = await uploadToCloudinary(req.file.buffer);

        const listing = new Listing({
            userId: req.user.id,
            title,
            price: Number(price),
            description,
            type,
            category: category || 'other',
            condition: condition || 'good',
            location,
            image
        });

        await listing.save();
        await listing.populate('userId', 'name username address');
        res.status(201).json({ msg: 'Listing created', listing });
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ msg: error.message || 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const listing = await Listing.findOne({ _id: req.params.id, userId: req.user.id });
        if (!listing) return res.status(404).json({ msg: 'Listing not found or not owned by you' });
        await listing.deleteOne();
        res.json({ msg: 'Listing deleted' });
    } catch (error) {
        console.error('Delete listing error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
