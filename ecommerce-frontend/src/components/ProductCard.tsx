import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';
import '../styles/products.css';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
    brand: string;
    images: string[];
    ratings: {
      average: number;
      count: number;
    };
    stock: number;
  };
}

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cartLoading, user, wishlist, addToWishlist, removeFromWishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    setAddingToCart(true);
    
    try {
      await addToCart(product._id, 1);
      alert('Item added to cart!');
    } catch (error: any) {
      console.error('Add to cart error:', error);
      alert(`Failed to add to cart: ${error.message}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to use wishlist');
      return;
    }
    
    const isWishlisted = wishlist.some(p => p._id === product._id);
    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };


  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-container">
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="product-image-placeholder">
              <span>No Image</span>
            </div>
          )}
          
          {product.stock < 10 && product.stock > 0 && (
            <div className="stock-badge low-stock">
              Only {product.stock} left
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="stock-badge out-of-stock">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-category">{product.category}</div>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-brand">{product.brand}</div>
          
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.ratings.average)}
            </div>
            <span className="rating-count">
              ({product.ratings.count})
            </span>
          </div>
          
          <div className="product-price-row">
            <div className="product-price">₹{product.price.toFixed(2)}</div>
            <div className="product-actions-group">
              <button 
                className={`wishlist-btn ${wishlist.some(p => p._id === product._id) ? 'active' : ''} ${isHovered ? 'visible' : ''}`}
                onClick={handleWishlistToggle}
                title="Add to Wishlist"
              >
                <HeartIcon filled={wishlist.some(p => p._id === product._id)} />
              </button>
              <button
                className={`add-to-cart-btn ${isHovered ? 'visible' : ''}`}
                onClick={handleAddToCart}
                disabled={addingToCart || cartLoading || product.stock === 0}
              >
                {addingToCart || cartLoading ? (
                  <span className="loading-spinner">Adding...</span>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
