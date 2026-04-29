import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';

const Navbar: React.FC = () => {
  const { user, setUser } = useApp();
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
            <div className="user-menu">
              <span className="user-name">Welcome, {user.name}</span>
              <button className="navbar-btn logout" onClick={handleLogout}>
                Logout
              </button>
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
