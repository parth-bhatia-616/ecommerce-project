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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cartLoading, user } = useApp();
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
      </Link>
    </div>
  );
};

export default ProductCard;
