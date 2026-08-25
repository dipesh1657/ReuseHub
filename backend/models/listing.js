const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['sell', 'exchange'], required: true },
    category: { type: String, enum: ['electronics', 'furniture', 'books', 'clothing', 'other'], default: 'other' },
    condition: { type: String, enum: ['new', 'good', 'fair', 'poor'], default: 'good' },
    status: { type: String, enum: ['Active', 'Sold', 'Inactive'], default: 'Active' },
    image: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);