import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddNewListings.css';

function AddNewListings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        type: 'sell',
        category: 'other',
        condition: 'good',
        image: ''
    });

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                alert('Please login first');
                return;
            }

            const parsedUser = JSON.parse(userData);
            const username = parsedUser.username;

            const response = await fetch('http://localhost:3000/api/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    ...formData,
                    price: parseFloat(formData.price)
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Listing added successfully!');
                navigate('/my-items');
            } else {
                alert(data.msg || 'Failed to add listing');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Add New Listing</h1>
                <p>List your item for sale or exchange</p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter item title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Describe your item"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="sell">Sell</option>
                        <option value="exchange">Exchange</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="electronics">Electronics</option>
                            <option value="furniture">Furniture</option>
                            <option value="books">Books</option>
                            <option value="clothing">Clothing</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Condition</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                        >
                            <option value="new">New</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL (optional)</label>
                    <input
                        type="text"
                        name="image"
                        placeholder="Paste image URL"
                        value={formData.image}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/my-items')}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddNewListings;