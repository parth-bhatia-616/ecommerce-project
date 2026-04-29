const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('vertexToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // Try to parse error as JSON, fallback to text
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, try to get text
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Try to parse successful response as JSON
    try {
      return await response.json();
    } catch {
      // If response is not JSON, return text
      const text = await response.text();
      return text;
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getCurrentUser: () => apiRequest('/auth/me'),
  
  updateProfile: (profileData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  
  getProduct: (id) => apiRequest(`/products/${id}`),
  
  getCategories: () => apiRequest('/products/meta/categories'),
  
  getBrands: () => apiRequest('/products/meta/brands'),
};

// Cart API
export const cartAPI = {
  getCart: () => apiRequest('/cart'),
  
  addToCart: (productId, quantity = 1) => apiRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }),
  
  updateCartItem: (productId, quantity) => apiRequest('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  }),
  
  removeFromCart: (productId) => apiRequest(`/cart/remove/${productId}`, {
    method: 'DELETE',
  }),
  
  clearCart: () => apiRequest('/cart/clear', { method: 'DELETE' }),
  
  getCartSummary: () => apiRequest('/cart/summary'),
};

// Orders API
export const ordersAPI = {
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/orders${query ? `?${query}` : ''}`);
  },
  
  getOrder: (id) => apiRequest(`/orders/${id}`),
  
  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, {
    method: 'PUT',
  }),
};

// Users API
export const usersAPI = {
  getWishlist: () => apiRequest('/users/wishlist'),
  
  addToWishlist: (productId) => apiRequest(`/users/wishlist/${productId}`, {
    method: 'POST',
  }),
  
  removeFromWishlist: (productId) => apiRequest(`/users/wishlist/${productId}`, {
    method: 'DELETE',
  }),
  
  addReview: (productId, rating, comment) => apiRequest(`/users/review/${productId}`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  }),
};

export default apiRequest;
