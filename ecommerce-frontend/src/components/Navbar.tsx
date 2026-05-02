import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const Navbar: React.FC = () => {
  const { user, setUser, wishlist } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('vertexToken');
      localStorage.removeItem('vertexUser');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/main" className="brand-link">
            <h2>Vertex</h2>
          </NavLink>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink 
            to="/main" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink 
            to="/cart" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </NavLink>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-actions">
              <div className="navbar-wishlist">
                <div className="wishlist-icon-container">
                  <HeartIcon />
                  {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
                </div>
                <div className="wishlist-dropdown">
                  <div className="wishlist-dropdown-header">Your Wishlist</div>
                  <div className="wishlist-dropdown-items">
                    {wishlist.length === 0 ? (
                      <div className="wishlist-empty">No items yet</div>
                    ) : (
                      wishlist.map(item => (
                        <NavLink to={`/products/${item._id}`} key={item._id} className="wishlist-item" onClick={() => setIsMenuOpen(false)}>
                          <img src={item.images[0]} alt={item.name} />
                          <div className="wishlist-item-info">
                            <div className="wishlist-item-name">{item.name}</div>
                            <div className="wishlist-item-price">₹{item.price.toFixed(2)}</div>
                          </div>
                        </NavLink>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="user-menu">
                <span className="user-name">Welcome, {user.name}</span>
                <button className="navbar-btn logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="navbar-btn login-btn">
                Login
              </NavLink>
              <NavLink to="/register" className="navbar-btn register-btn">
                Register
              </NavLink>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
