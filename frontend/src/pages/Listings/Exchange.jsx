import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Exchange.css';

function Exchange() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchListings();
    }, []);

    async function fetchListings() {
        try {
            // ✅ Correct endpoint
            const response = await fetch('http://localhost:3000/api/listings/all');
            const data = await response.json();

            if (response.ok) {
                // ✅ Filter only exchange items
                const exchangeItems = data.listings.filter(item => item.type === 'exchange');
                setListings(exchangeItems);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    function getCategoryIcon(category) {
        const icons = {
            electronics: '📱',
            furniture: '🪑',
            books: '📚',
            clothing: '👕'
        };
        return icons[category] || '📦';
    }

    const filteredListings = listings.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="listings-container">
            <div className="listings-header exchange-header">
                <h1>Exchange Items</h1>
                <p>Find items available for exchange</p>
            </div>

            <div className="listings-search">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="listings-count">
                {filteredListings.length} items found
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : filteredListings.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <h3>No items for exchange</h3>
                    <p>Check back later for new listings</p>
                </div>
            ) : (
                <div className="listings-grid">
                    {filteredListings.map((item) => (
                        <div key={item._id} className="listing-card">
                            <div className="card-image">
                                <span className="card-placeholder">
                                    {getCategoryIcon(item.category)}
                                </span>
                                <span className="card-badge exchange-badge">For Exchange</span>
                            </div>
                            <div className="card-info">
                                <h3>{item.title}</h3>
                                <p className="card-price">₹{item.price}</p>
                                <p className="card-desc">{item.description}</p>
                                <div className="card-meta">
                                    <span>{getCategoryIcon(item.category)} {item.category}</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Link to={`/listing/${item._id}`} className="view-btn">View Details</Link>
                                <br></br>
                                <Link to={'/exchange/${item.id}'} className='view-btn'>Exchange</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Exchange;