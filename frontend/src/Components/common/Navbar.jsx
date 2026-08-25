import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">♻️</span>
                    ReuseHub
                </Link>

                <ul className="nav-menu">
                    <li><Link to="/" className="nav-link active">Dashboard</Link></li>
                    <li><Link to="/buy" className="nav-link">Buy</Link></li>
                    <li><Link to="/sell" className="nav-link">Sell</Link></li>
                    <li><Link to="/exchange" className="nav-link">Exchange</Link></li>
                </ul>

                <div className="navbar-right">
                    <div className="profile-dropdown">
                        <button className="profile-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                           
                            <span className="profile-name">👤Profile</span>
                            <span className="dropdown-arrow">▼</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to="/my-profile" className="dropdown-item">👤 My Profile</Link>
                                <Link to="/my-items" className="dropdown-item">📦 My Items</Link>
                                <hr className="dropdown-divider" />
                                <button onClick={handleLogout} className="dropdown-item logout-btn">
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;