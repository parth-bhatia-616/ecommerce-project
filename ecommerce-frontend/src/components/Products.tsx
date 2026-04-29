import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import '../styles/globals.css';
import '../styles/products.css';

const Products: React.FC = () => {
  const { 
    filteredProducts, 
    loading, 
    error, 
    filters, 
    setFilters, 
    products,
    cartItems
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice,
    max: filters.maxPrice
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories and brands from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, setFilters]);

  // Update price range filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ minPrice: priceRange.min, maxPrice: priceRange.max });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [priceRange, setFilters]);

  const handleCategoryChange = (category: string) => {
    setFilters({ category: category === 'All' ? '' : category });
  };

  const handleBrandChange = (brand: string) => {
    setFilters({ brand: brand === 'All' ? '' : brand });
  };

  const handleSortChange = (sort: string) => {
    setFilters({ sort });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: 0, max: 10000 });
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      search: '',
      brand: '',
      sort: '-createdAt'
    });
  };

  const maxPriceInProducts = Math.max(...products.map(p => p.price), 10000);

  // Recommendations Logic
  const getRecommendations = () => {
    // Filter out any invalid cart items (e.g., if a product was deleted from DB)
    const validCartItems = cartItems.filter(item => item && item.product);
    
    // Exclude products already in cart
    const cartProductIds = new Set(validCartItems.map(item => item.product._id));
    let availableProducts = products.filter(p => !cartProductIds.has(p._id));
    
    let targetCategory = '';
    
    // If user has cart items -> recommend products from same category
    if (validCartItems.length > 0) {
      targetCategory = validCartItems[validCartItems.length - 1].product.category;
    } 
    // If category filter exists -> recommend similar category products
    else if (filters.category && filters.category !== 'All') {
      targetCategory = filters.category;
    }
    
    if (targetCategory) {
      const sameCategory = availableProducts.filter(p => p.category === targetCategory);
      if (sameCategory.length > 0) {
        availableProducts = sameCategory;
      }
    }
    
    // Return top 3 products
    return availableProducts.slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Browse Products</h1>
        <div className="products-stats">
          {filteredProducts.length} of {products.length} products
        </div>
      </div>

      <div className="products-layout">
        {/* Filters Sidebar */}
        <div className={`filters-sidebar ${showFilters ? 'mobile-open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category || 'All'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <label>Brand</label>
            <select
              value={filters.brand || 'All'}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="filter-select"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range-container">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="price-input"
                />
              </div>
              <input
                type="range"
                min="0"
                max={maxPriceInProducts}
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="price-slider"
              />
              <div className="price-display">
                ₹{priceRange.min} - ₹{priceRange.max}
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="-name">Name: Z to A</option>
              <option value="-ratings.average">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Products Grid */}
        <div className="products-content">
          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner">Loading products...</div>
            </div>
          ) : error ? (
            <div className="products-error">
              <div className="error-message">{error}</div>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="products-empty">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-display-area">
              {/* Recommendations Section */}
              {recommendations.length > 0 && (
                <div className="recommendations-section" style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>
                    Recommended for You ✨
                  </h2>
                  <div className="products-grid">
                    {recommendations.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white', borderTop: recommendations.length > 0 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none', paddingTop: recommendations.length > 0 ? '2rem' : '0' }}>
                All Products
              </h2>
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
