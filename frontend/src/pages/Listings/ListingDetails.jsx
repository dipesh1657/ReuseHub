import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RequestForm from './RequestForm';
import '../../styles/ListingDetails.css';

function ListingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRequest, setShowRequest] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const response = await fetch(`http://localhost:3000/api/listings/${id}`, { credentials: 'include' });
                const data = await response.json();
                if (!response.ok) throw new Error(data.msg || 'Listing not found');
                setListing(data.listing);
            } catch (error) {
                alert(error.message);
                navigate('/buy');
            } finally { setLoading(false); }
        }
        load();
    }, [id, navigate]);

    function handleRequestSuccess(message) {
        setShowRequest(false);
        alert(message);
        navigate('/requests');
    }

    if (loading) return <div className="details-page"><p>Loading...</p></div>;
    if (!listing) return null;

    const seller = listing.userId;
    const requestType = listing.type === 'sell' ? 'BUY' : 'EXCHANGE';

    return (
        <div className="details-page">
            <Link to={listing.type === 'sell' ? '/buy' : '/exchange'} className="back-link">← Back</Link>
            <div className="details-card">
                <div className="details-image">
                    {listing.image ? <img src={listing.image} alt={listing.title} /> : <span>📦</span>}
                </div>
                <div className="details-content">
                    <span className="details-type">{listing.type === 'sell' ? 'For Sale' : 'For Exchange'}</span>
                    <h1>{listing.title}</h1>
                    <h2>₹{listing.price}</h2>
                    <p className="details-description">{listing.description}</p>
                    <div className="details-grid">
                        <div><strong>Category</strong><span>{listing.category}</span></div>
                        <div><strong>Condition</strong><span>{listing.condition}</span></div>
                        <div><strong>Seller</strong><span>{seller?.name || seller?.username || 'Unknown'}</span></div>
                        <div><strong>Location</strong><span>{listing.location}</span></div>
                        <div><strong>Date posted</strong><span>{new Date(listing.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <button className={`details-action ${listing.type === 'sell' ? 'buy-action' : 'exchange-action'}`} onClick={() => setShowRequest(true)}>
                        {listing.type === 'sell' ? 'Buy' : 'Exchange'}
                    </button>
                </div>
            </div>
            {showRequest && <RequestForm listing={listing} type={requestType} onClose={() => setShowRequest(false)} onSuccess={handleRequestSuccess} />}
        </div>
    );
}

export default ListingDetails;
