import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/globals.css';
import '../styles/main.css';

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        orders: 12,
        wishlist: 8,
        pending: 3,
        spent: 247
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = localStorage.getItem('vertexToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const userData = await authAPI.getCurrentUser();
                setUser(userData.user);
                setStats(userData.stats);
            } catch (error) {
                console.error('Failed to load user data:', error);
                // Clear invalid token and redirect to login
                localStorage.removeItem('vertexToken');
                localStorage.removeItem('vertexUser');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and redirect
            localStorage.removeItem('vertexToken');
            localStorage.removeItem('vertexUser');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="main-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="main-container">
            {/* Main Content */}
            <main className="main-content">
                <div className="welcome-section">
                    <div className="welcome-card">
                        <h1 className="welcome-title">Welcome to Vertex! 🎉</h1>
                        <p className="welcome-message">
                            You have successfully logged in to your account. 
                            This is your personalized dashboard where you can manage your shopping experience.
                        </p>
                        <div className="feature-grid">
                            <div className="feature-card" onClick={() => navigate('/products')}>
                                <div className="feature-icon">🛍️</div>
                                <h3>Browse Products</h3>
                                <p>Explore our wide range of premium products</p>
                            </div>
                            <div className="feature-card" onClick={() => navigate('/cart')}>
                                <div className="feature-icon">🛒</div>
                                <h3>Shopping Cart</h3>
                                <p>View and manage your shopping cart</p>
                            </div>
                            <div className="feature-card" onClick={() => navigate('/profile')}>
                                <div className="feature-icon">�</div>
                                <h3>My Profile</h3>
                                <p>Manage your account and preferences</p>
                            </div>
                            <div className="feature-card" onClick={() => navigate('/products')}>
                                <div className="feature-icon">�</div>
                                <h3>Order History</h3>
                                <p>Track your orders and deliveries</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div className="stats-section">
                    <h2>Your Shopping Stats</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-number">{stats.orders}</div>
                            <div className="stat-label">Orders Placed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">❤️</div>
                            <div className="stat-number">{stats.wishlist}</div>
                            <div className="stat-label">Wishlist Items</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⏰</div>
                            <div className="stat-number">{stats.pending}</div>
                            <div className="stat-label">Pending Orders</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-number">₹{stats.spent}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon delivered">📦</div>
                            <div className="activity-details">
                                <p className="activity-title">Order #1234 Delivered</p>
                                <p className="activity-time">2 days ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon pending">❤️</div>
                            <div className="activity-details">
                                <p className="activity-title">Added 3 items to wishlist</p>
                                <p className="activity-time">5 days ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon review">💬</div>
                            <div className="activity-details">
                                <p className="activity-title">Left a product review</p>
                                <p className="activity-time">1 week ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 Vertex. All rights reserved.</p>
                    <div className="footer-links">
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/help">Help</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Main;
