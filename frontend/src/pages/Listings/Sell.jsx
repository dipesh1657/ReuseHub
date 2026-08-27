import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Listings.css';

function Sell() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    async function fetchListings() {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const parsedUser = JSON.parse(userData);
            const username = parsedUser.username;

            const response = await fetch(`http://localhost:3000/api/listings/my/${username}`);
            const data = await response.json();

            if (response.ok) {
                setListings(data.listings || []);
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

    const sellItems = listings.filter(item => item.type === 'sell');

    return (
        <div className="listings-container">
            <div className="listings-header sell-header">
                <h1>Sell Items</h1>
                <p>Manage your items for sale</p>
                <Link to="/add-listing" className="add-btn">+ Add New Listing</Link>
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : sellItems.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <h3>No items for sale</h3>
                    <p>Start selling your items today</p>
                    <Link to="/add-listing" className="empty-link">+ Add Your First Listing</Link>
                </div>
            ) : (
                <div className="listings-grid">
                    {sellItems.map((item) => (
                        <div key={item._id} className="listing-card">
                            <div className="card-image">
                                <span className="card-placeholder">
                                    {getCategoryIcon(item.category)}
                                </span>
                                <span className="card-status">{item.status}</span>
                                <span className="card-badge">For Sale</span>
                            </div>
                            <div className="card-info">
                                <h3>{item.title}</h3>
                                <p className="card-price">₹{item.price}</p>
                                <p className="card-desc">{item.description}</p>
                                <div className="card-actions">
                                    <Link to={`/edit-listing/${item._id}`} className="edit-btn">Edit</Link>
                                    <Link to={`/listing/${item._id}`} className="view-btn">View</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Sell;