import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../../Components/common/Navbar';
import Buy from '../Listings/Buy';
import Sell from '../Listings/Sell';
import Exchange from '../Listings/Exchange';
import MyItems from '../profile/MyItems';
import MyProfile from '../profile/MyProfile';
import AddNewListings from '../profile/AddNewListings';
import '../../styles/Dashboard.css';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllListings();
    }, []);

    async function fetchAllListings() {
        try {
            const response = await fetch('http://localhost:3000/api/listings/all');
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

    function HomeContent() {
        return (
            <div className="dashboard-container">
                {/* Hero Section */}
                <div className="dashboard-hero">
                    <div className="hero-content">
                        <h1>Discover Amazing Finds</h1>
                        <p>Buy, sell, and exchange items with your community</p>
                        <div className="hero-buttons">
                            <Link to="/buy" className="btn-primary">Start Shopping</Link>
                            <Link to="/my-items" className="btn-secondary">My Items</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <span>♻️</span>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="dashboard-categories">
                    <h2>Browse Categories</h2>
                    <div className="category-grid">
                        <Link to="/buy" className="category-card">
                            <span className="category-icon">📱</span>
                            <h3>Electronics</h3>
                            <p>Phones, laptops, accessories</p>
                        </Link>
                        <Link to="/buy" className="category-card">
                            <span className="category-icon">🪑</span>
                            <h3>Furniture</h3>
                            <p>Tables, chairs, sofas</p>
                        </Link>
                        <Link to="/buy" className="category-card">
                            <span className="category-icon">📚</span>
                            <h3>Books</h3>
                            <p>Textbooks, novels, magazines</p>
                        </Link>
                        <Link to="/buy" className="category-card">
                            <span className="category-icon">👕</span>
                            <h3>Clothing</h3>
                            <p>Men, women, kids fashion</p>
                        </Link>
                    </div>
                </div>

                {/* Latest Listings */}
                <div className="dashboard-listings">
                    <div className="section-header">
                        <h2>Latest Listings</h2>
                        <Link to="/buy" className="view-all">View All →</Link>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="skeleton-card"></div>
                            ))}
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🏪</span>
                            <h3>No listings yet</h3>
                            <p>Be the first to list an item on ReuseHub</p>
                            <Link to="/my-items" className="btn-primary">Go to My Items</Link>
                        </div>
                    ) : (
                        <div className="listings-grid">
                            {listings.slice(0, 8).map((item) => (
                                <div key={item._id} className="listing-card">
                                    <div className="card-image">
                                        <span className="card-placeholder">
                                            {getCategoryIcon(item.category)}
                                        </span>
                                        <span className={`card-badge ${item.type === 'sell' ? 'badge-sell' : 'badge-exchange'}`}>
                                            {item.type === 'sell' ? 'For Sale' : 'For Exchange'}
                                        </span>
                                    </div>
                                    <div className="card-info">
                                        <h4>{item.title}</h4>
                                        <p className="card-price">₹{item.price}</p>
                                        <div className="card-footer">
                                            <span className="card-category">{getCategoryIcon(item.category)} {item.category}</span>
                                            <Link to={`/listing/${item._id}`} className="view-btn">View</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="dashboard-cta">
                    <div className="cta-content">
                        <h2>Want to Sell or Exchange?</h2>
                        <p>Go to My Items to list your items for sale or exchange</p>
                        <Link to="/my-items" className="btn-primary">Go to My Items</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomeContent />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/my-items" element={<MyItems />} />
                <Route path="/add-listing" element={<AddNewListings />} />
                <Route path="/my-profile" element={<MyProfile />} />
            </Routes>
        </div>
    );
}

export default Dashboard;