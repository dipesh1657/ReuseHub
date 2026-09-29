const express = require('express');
const router = express.Router();
const ContactRequest = require('../models/contactRequest');
const Listing = require('../models/listing');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const { listingId, type, requesterEmail, requesterWhatsapp, message, offeredListingId } = req.body;

        if (!listingId || !type || !requesterEmail || !requesterWhatsapp) {
            return res.status(400).json({ msg: 'Listing, request type, email and WhatsApp number are required' });
        }

        const normalizedType = String(type).toUpperCase();
        if (!['BUY', 'EXCHANGE'].includes(normalizedType)) {
            return res.status(400).json({ msg: 'Invalid request type' });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ msg: 'Listing not found' });

        if (listing.userId.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot send a request for your own item' });
        }

        if (normalizedType === 'BUY' && listing.type !== 'sell') {
            return res.status(400).json({ msg: 'This item is not available for buying' });
        }

        if (normalizedType === 'EXCHANGE' && listing.type !== 'exchange') {
            return res.status(400).json({ msg: 'This item is not available for exchange' });
        }

        let offeredListing = null;
        if (normalizedType === 'EXCHANGE') {
            if (!offeredListingId) {
                return res.status(400).json({ msg: 'Please select an item you want to offer' });
            }

            offeredListing = await Listing.findOne({
                _id: offeredListingId,
                userId: req.user.id
            });

            if (!offeredListing) {
                return res.status(400).json({ msg: 'The offered item is invalid or does not belong to you' });
            }
        }

        const duplicate = await ContactRequest.findOne({
            listing: listingId,
            requester: req.user.id,
            type: normalizedType
        });

        if (duplicate) {
            return res.status(409).json({ msg: 'You already sent a request for this item' });
        }

        const request = await ContactRequest.create({
            listing: listing._id,
            seller: listing.userId,
            requester: req.user.id,
            offeredListing: offeredListing?._id || null,
            requesterEmail: requesterEmail.trim(),
            requesterWhatsapp: requesterWhatsapp.trim(),
            message: message || '',
            type: normalizedType
        });

        const populatedRequest = await ContactRequest.findById(request._id)
            .populate('listing', 'title image price type location')
            .populate('offeredListing', 'title image price type location')
            .populate('requester', 'name username email')
            .populate('seller', 'name username email');

        res.status(201).json({
            msg: `${normalizedType === 'BUY' ? 'Buy' : 'Exchange'} request sent successfully`,
            request: populatedRequest
        });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/received', async (req, res) => {
    try {
        const requests = await ContactRequest.find({ seller: req.user.id })
            .populate('listing', 'title image price type location')
            .populate('offeredListing', 'title image price type location')
            .populate('requester', 'name username email')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        console.error('Get received requests error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/sent', async (req, res) => {
    try {
        const requests = await ContactRequest.find({ requester: req.user.id })
            .populate('listing', 'title image price type location')
            .populate('offeredListing', 'title image price type location')
            .populate('seller', 'name username email')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        console.error('Get sent requests error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
