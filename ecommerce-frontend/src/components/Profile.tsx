import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authAPI } from '../services/api';
import '../styles/globals.css';
import '../styles/profile.css';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  addresses: {
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
}

const Profile: React.FC = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    addresses: []
  });
  
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses || []
      });
      setProfileLoading(false);
    } else {
      setProfileLoading(true);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      setError('Please fill in all address fields');
      return;
    }

    const updatedAddresses = [...profileData.addresses];
    
    // If this is the default address, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses.forEach(addr => addr.isDefault = false);
    }
    
    updatedAddresses.push(newAddress);
    
    setProfileData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
    
    // Reset new address form
    setNewAddress({
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
    
    setSuccess('Address added successfully!');
  };

  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = profileData.addresses.filter((_, i) => i !== index);
    setProfileData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
    setSuccess('Address removed successfully!');
  };

  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = profileData.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    
    setProfileData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Show loading while profile data is being set
  if (profileLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button
          className={`edit-profile-btn ${isEditing ? 'active' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-layout">
        {/* Profile Information */}
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <label>Full Name</label>
                <span>{profileData.name}</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>{profileData.email}</span>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <span>{profileData.phone}</span>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="addresses-card">
          <h3>Shipping Addresses</h3>
          
          {profileData.addresses.length === 0 ? (
            <div className="no-addresses">
              <p>No addresses saved yet</p>
            </div>
          ) : (
            <div className="addresses-list">
              {profileData.addresses.map((address, index) => (
                <div key={index} className="address-item">
                  <div className="address-header">
                    <span className="address-type">
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                    </span>
                    {address.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  <div className="address-details">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  <div className="address-actions">
                    {!address.isDefault && (
                      <button
                        className="set-default-btn"
                        onClick={() => handleSetDefaultAddress(index)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className="remove-address-btn"
                      onClick={() => handleRemoveAddress(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Address Form */}
          <div className="add-address-form">
            <h4>Add New Address</h4>
            <div className="address-form-grid">
              <div className="form-group">
                <label>Address Type</label>
                <select
                  name="type"
                  value={newAddress.type}
                  onChange={handleAddressChange}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main St"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  placeholder="New York"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  placeholder="NY"
                />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleAddressChange}
                  placeholder="10001"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                  placeholder="United States"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleAddressChange}
                  />
                  Set as default address
                </label>
              </div>
            </div>

            <button
              className="add-address-btn"
              onClick={handleAddAddress}
            >
              Add Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
