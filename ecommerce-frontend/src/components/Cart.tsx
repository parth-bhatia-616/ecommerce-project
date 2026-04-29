import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';
import '../styles/cart.css';

const Cart: React.FC = () => {
  const { 
    cartItems, 
    cartTotal, 
    cartLoading, 
    removeFromCart, 
    updateCartItem, 
    clearCart 
  } = useApp();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Clear cart error:', error);
      }
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Navigate to checkout page (to be implemented)
    setTimeout(() => {
      setIsCheckingOut(false);
      alert('Checkout functionality coming soon!');
    }, 1000);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 9.99;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  if (cartLoading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="loading-spinner">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <div className="cart-item-count">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h3>Items</h3>
              <button 
                className="clear-cart-btn"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  <div className="cart-item-details">
                    <Link 
                      to={`/products/${item.product._id}`}
                      className="cart-item-name"
                    >
                      {item.product.name}
                    </Link>
                    <div className="cart-item-brand">{item.product.brand}</div>
                    <div className="cart-item-category">{item.product.category}</div>
                    <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                  </div>

                  <div className="cart-item-quantity">
                    <label>Quantity</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value) || 1)}
                        className="quantity-input"
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    {item.quantity >= item.product.stock && (
                      <div className="stock-warning">
                        Max quantity reached
                      </div>
                    )}
                  </div>

                  <div className="cart-item-total">
                    <div className="item-total-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="remove-item-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping().toFixed(2)}`}
              </span>
            </div>
            
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{calculateTax().toFixed(2)}</span>
            </div>
            
            {calculateSubtotal() < 50 && (
              <div className="shipping-notice">
                Add ₹{(50 - calculateSubtotal()).toFixed(2)} more for FREE shipping!
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut || cartItems.some(item => item.quantity > item.product.stock)}
            >
              {isCheckingOut ? (
                <span className="loading-spinner">Processing...</span>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <Link to="/products" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
