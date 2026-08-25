import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

function MyProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                navigate('/login');
                return;
            }

            const parsedUser = JSON.parse(userData);
            const username = parsedUser.username;

            const response = await fetch(`http://localhost:3000/api/profile/${username}`);
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p className="loading-text">Loading profile...</p>;
    }

    if (!user) {
        return <p className="loading-text">No user data found</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    <p>@{user.username}</p>
                </div>
            </div>

            <div className="profile-details">
                <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Username</span>
                    <span className="detail-value">@{user.username}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{user.address || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;