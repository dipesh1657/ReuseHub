import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Components/Auth/AuthContext';
import '../../styles/RequestForm.css';

function RequestForm({ listing, type, onClose, onSuccess }) {
    const { user } = useAuth();
    const [email, setEmail] = useState(user?.email || '');
    const [whatsapp, setWhatsapp] = useState('');
    const [message, setMessage] = useState('');
    const [offeredListingId, setOfferedListingId] = useState('');
    const [myListings, setMyListings] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (type !== 'EXCHANGE') return;
        async function loadMyListings() {
            try {
                const response = await fetch('http://localhost:3000/api/listings/my', { credentials: 'include' });
                const data = await response.json();
                if (response.ok) setMyListings((data.listings || []).filter(item => item._id !== listing._id));
            } catch { setError('Could not load your items'); }
        }
        loadMyListings();
    }, [type, listing._id]);

    async function handleSubmit(e) {
        e.preventDefault(); setError('');
        if (!email.trim() || !whatsapp.trim()) return setError('Email and WhatsApp number are required.');
        if (type === 'EXCHANGE' && !offeredListingId) return setError('Please select an item you want to offer.');
        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/requests', {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: listing._id, type, requesterEmail: email.trim(), requesterWhatsapp: whatsapp.trim(), message: message.trim(), offeredListingId: type === 'EXCHANGE' ? offeredListingId : undefined })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Could not send request');
            onSuccess(data.msg);
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    }

    return <div className="request-overlay" onClick={onClose}>
        <div className="request-modal" onClick={e => e.stopPropagation()}>
            <button className="request-close" onClick={onClose}>×</button>
            <h2>{type === 'BUY' ? 'Buy Request' : 'Exchange Request'}</h2>
            <p className="request-item">{listing.title}</p>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                <label>WhatsApp Number</label>
                <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Include country code, e.g. +91 9876543210" required />
                {type === 'EXCHANGE' && <>
                    <label>Item you want to offer</label>
                    <select value={offeredListingId} onChange={e => setOfferedListingId(e.target.value)}>
                        <option value="">Select one of your items</option>
                        {myListings.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                    </select>
                </>}
                <label>Message {type === 'BUY' ? '(optional)' : ''}</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={type === 'BUY' ? 'I am interested in buying this item...' : 'Tell the owner why you want to exchange...'} rows="4" />
                {error && <p className="request-error">{error}</p>}
                <button className="request-submit" type="submit" disabled={submitting}>{submitting ? 'Sending...' : `Send ${type === 'BUY' ? 'Buy' : 'Exchange'} Request`}</button>
            </form>
        </div>
    </div>;
}
export default RequestForm;
