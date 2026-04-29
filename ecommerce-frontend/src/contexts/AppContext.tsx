import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { productsAPI, cartAPI } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  features: string[];
  specifications: Map<string, string>;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  wishlist: string[];
  addresses: any[];
  createdAt: string;
}

interface AppContextType {
  // Products
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (params?: any) => void;
  
  // Cart
  cartItems: CartItem[];
  cartTotal: number;
  cartLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Wishlist
  wishlist: Product[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  
  // Filters
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
    brand: string;
    sort: string;
  };
  setFilters: (filters: Partial<AppContextType['filters']>) => void;
  filteredProducts: Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  
  // User state
  const [user, setUserState] = useState<User | null>(null);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Filters state
  const [filters, setFiltersState] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    search: '',
    brand: '',
    sort: '-createdAt'
  });

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('vertexUser');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('vertexUser');
      }
    }
  }, []);

  // Fetch products
  const fetchProducts = async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getProducts(params);
      setProducts(response.products);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch products');
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    if (!user) return;
    
    setCartLoading(true);
    try {
      const response = await cartAPI.getCart();
      // Filter out invalid items (e.g., if a product was deleted from DB but remains in user's cart)
      const validCartItems = response.cart.filter((item: any) => item && item.product);
      setCartItems(validCartItems);
    } catch (error: any) {
      console.error('Fetch cart error:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    
    setCartLoading(true);
    try {
      await cartAPI.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart
    } catch (error: any) {
      throw error;
    } finally {
      setCartLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    setCartLoading(true);
    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart(); // Refresh cart
    } catch (error: any) {
      console.error('Remove from cart error:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // Update cart item
  const updateCartItem = async (productId: string, quantity: number) => {
    setCartLoading(true);
    try {
      await cartAPI.updateCartItem(productId, quantity);
      await fetchCart(); // Refresh cart
    } catch (error: any) {
      console.error('Update cart error:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCartLoading(true);
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (error: any) {
      console.error('Clear cart error:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId: string) => {
    if (!user) return;
    
    try {
      // This would be implemented when we have the usersAPI
      // await usersAPI.addToWishlist(productId);
      console.log('Added to wishlist:', productId);
    } catch (error: any) {
      console.error('Add to wishlist error:', error);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    
    try {
      // This would be implemented when we have the usersAPI
      // await usersAPI.removeFromWishlist(productId);
      console.log('Removed from wishlist:', productId);
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
    }
  };

  // Set user
  const setUser = (userData: User | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('vertexUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('vertexUser');
    }
  };

  // Set filters
  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    return true;
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const value: AppContextType = {
    // Products
    products,
    loading,
    error,
    fetchProducts,
    
    // Cart
    cartItems,
    cartTotal,
    cartLoading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    fetchCart,
    
    // User
    user,
    setUser,
    
    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    
    // Filters
    filters,
    setFilters,
    filteredProducts,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
