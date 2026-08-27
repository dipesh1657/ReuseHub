import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/MyItems.css';

function MyItems() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

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

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/listing/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setListings(listings.filter(item => item._id !== id));
                alert('Item deleted successfully');
            }
        } catch (error) {
            alert('Failed to delete item');
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
    const exchangeItems = listings.filter(item => item.type === 'exchange');

    function getFilteredItems() {
        if (activeTab === 'sell') return sellItems;
        if (activeTab === 'exchange') return exchangeItems;
        return listings;
    }

    const filteredItems = getFilteredItems();

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Items</h1>
                <p>Manage your listings</p>
                <Link to="/add-listing" className="add-btn">+ Add New Listing</Link>
            </div>

            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All ({listings.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'sell' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sell')}
                >
                    Sell ({sellItems.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'exchange' ? 'active' : ''}`}
                    onClick={() => setActiveTab('exchange')}
                >
                    Exchange ({exchangeItems.length})
                </button>
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : filteredItems.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <h3>No items found</h3>
                    <p>Start listing your items today</p>
                    <Link to="/add-listing" className="empty-link">+ Add Your First Listing</Link>
                </div>
            ) : (
                <div className="listings-grid">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="listing-card">
                            <div className="card-image">
                                <span className="card-placeholder">
                                    {getCategoryIcon(item.category)}
                                </span>
                                <span className="card-status">{item.status}</span>
                                <span className="card-badge">
                                    {item.type === 'sell' ? 'For Sale' : 'For Exchange'}
                                </span>
                            </div>
                            <div className="card-info">
                                <h3>{item.title}</h3>
                                <p className="card-price">₹{item.price}</p>
                                <p className="card-desc">{item.description}</p>
                                <div className="card-meta">
                                    <span>{getCategoryIcon(item.category)} {item.category}</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="card-actions">
                                    <Link to={`/edit-listing/${item._id}`} className="edit-btn">Edit</Link>
                                    <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyItems;