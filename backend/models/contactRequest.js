const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredListing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', default: null },
    requesterEmail: { type: String, required: true, trim: true, lowercase: true },
    requesterWhatsapp: { type: String, required: true, trim: true },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    type: { type: String, enum: ['BUY', 'EXCHANGE'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
