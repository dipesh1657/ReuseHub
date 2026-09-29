import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddNewListings.css';

function AddNewListings() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        type: 'sell',
        category: 'other',
        condition: 'good',
        location: '',
        image: null
    });

    function handleChange(event) {
        const { name, value, files } = event.target;

        if (name === 'image') {
            const file = files?.[0] || null;

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            setImagePreview(
                file ? URL.createObjectURL(file) : ''
            );

            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);

        try {
            const body = new FormData();

            body.append('title', formData.title);
            body.append('price', formData.price);
            body.append('description', formData.description);
            body.append('type', formData.type);
            body.append('category', formData.category);
            body.append('condition', formData.condition);
            body.append('location', formData.location);

            if (formData.image) {
                body.append('image', formData.image);
            }

            const response = await fetch(
                'http://localhost:3000/api/listings',
                {
                    method: 'POST',
                    credentials: 'include',
                    body
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert('Listing added successfully!');

                if (data.listing && data.listing.image) {
                    setImagePreview(data.listing.image);
                }

                setTimeout(() => {
                    navigate('/my-items');
                }, 1500);

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

                <p>
                    Add complete item details so buyers know exactly what you are offering.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="profile-form"
            >

                <div className="form-group">

                    <label>Photo</label>

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required
                    />

                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                width: 180,
                                height: 140,
                                objectFit: 'cover',
                                marginTop: 10,
                                borderRadius: 10
                            }}
                        />
                    )}

                    <small>
                        JPG, PNG, WEBP • maximum 5MB
                    </small>

                </div>

                <div className="form-group">

                    <label>Title</label>

                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. iPhone 13"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>Price (₹)</label>

                    <input
                        type="number"
                        min="0"
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
                        placeholder="Describe the item, age, accessories, reason for selling, etc."
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        required
                    />

                </div>

                <div className="form-group">

                    <label>Type</label>

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="sell">
                            Sell
                        </option>

                        <option value="exchange">
                            Exchange
                        </option>
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
                            <option value="electronics">
                                Electronics
                            </option>

                            <option value="furniture">
                                Furniture
                            </option>

                            <option value="books">
                                Books
                            </option>

                            <option value="clothing">
                                Clothing
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>

                    </div>

                    <div className="form-group">

                        <label>Condition</label>

                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                        >
                            <option value="new">
                                New
                            </option>

                            <option value="good">
                                Good
                            </option>

                            <option value="fair">
                                Fair
                            </option>

                            <option value="poor">
                                Poor
                            </option>
                        </select>

                    </div>

                </div>

                <div className="form-group">

                    <label>Location</label>

                    <input
                        type="text"
                        name="location"
                        placeholder="e.g. Chandigarh, India"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/my-items')}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Add Listing'}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AddNewListings;