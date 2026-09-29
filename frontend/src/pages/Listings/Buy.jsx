import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../../styles/Buy.css';

function Buy() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category') || 'all';

    useEffect(() => { fetchListings(); }, []);

    async function fetchListings() {
        try {
            const response = await fetch('http://localhost:3000/api/listings/all', { credentials: 'include' });
            const data = await response.json();
            if (response.ok) setListings((data.listings || []).filter(item => item.type === 'sell'));
        } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    }

    const categories = ['all', 'electronics', 'furniture', 'books', 'clothing', 'other'];
    const filteredListings = listings.filter(item => {
        const matchesCategory = category === 'all' || item.category === category;
        const q = searchTerm.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="listings-container">
            <div className="listings-header buy-header">
                <h1>{category === 'all' ? 'Buy Items' : `${category[0].toUpperCase()}${category.slice(1)}`}</h1>
                <p>{category === 'all' ? 'Find great items for sale' : `Browse ${category} items for sale`}</p>
            </div>
            <div className="listings-search"><input type="text" placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {categories.map(cat => <button key={cat} onClick={() => setSearchParams(cat === 'all' ? {} : { category: cat })} style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid #ddd', cursor: 'pointer', background: category === cat ? '#4A90E2' : '#fff', color: category === cat ? '#fff' : '#333' }}>{cat[0].toUpperCase() + cat.slice(1)}</button>)}
            </div>
            <div className="listings-count">{filteredListings.length} items found</div>

            {loading ? <p className="loading-text">Loading...</p> : filteredListings.length === 0 ? (
                <div className="empty-state"><span className="empty-icon">📭</span><h3>No items found</h3><p>There are no items in this category yet.</p></div>
            ) : (
                <div className="listings-grid">
                    {filteredListings.map(item => <div key={item._id} className="listing-card">
                        <div className="card-image">
                            {item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="card-placeholder">📦</span>}
                            <span className="card-badge">For Sale</span>
                        </div>
                        <div className="card-info">
                            <h3>{item.title}</h3><p className="card-price">₹{item.price}</p><p className="card-desc">{item.description}</p>
                            <div className="card-meta"><span>📍 {item.location}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span></div>
                            <p className="card-seller">Seller: {item.userId?.name || item.userId?.username || 'Unknown'}</p>
                            <div className="card-actions listing-actions"><Link to={`/listing/${item._id}`} className="view-btn">View Details</Link><Link to={`/listing/${item._id}`} className="action-btn buy-action">Buy</Link></div>
                        </div>
                    </div>)}
                </div>
            )}
        </div>
    );
}

export default Buy;
