const express = require('express');
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await req.user.populate('cart.product', 'name price images stock');
    
    res.json({
      cart: user.cart || [],
      total: calculateCartTotal(user.cart)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = req.user;
    
    // Check if item already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
      }
      
      user.cart[existingItemIndex].quantity = newQuantity;
      user.cart[existingItemIndex].price = product.price; // Update to current price
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await user.save();

    // Return updated cart
    await user.populate('cart.product', 'name price images stock');
    
    res.json({
      message: 'Item added to cart',
      cart: user.cart,
      total: calculateCartTotal(user.cart)
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const user = req.user;
    
    // Find item in cart
    const cartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update quantity and price
    cartItem.quantity = quantity;
    cartItem.price = product.price;

    await user.save();

    // Return updated cart
    await user.populate('cart.product', 'name price images stock');
    
    res.json({
      message: 'Cart updated',
      cart: user.cart,
      total: calculateCartTotal(user.cart)
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    // Remove item from cart
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    // Return updated cart
    await user.populate('cart.product', 'name price images stock');
    
    res.json({
      message: 'Item removed from cart',
      cart: user.cart,
      total: calculateCartTotal(user.cart)
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const user = req.user;
    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared',
      cart: [],
      total: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cart/summary
// @desc    Get cart summary (for checkout)
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const user = await req.user.populate('cart.product', 'name price images stock');
    
    const subtotal = calculateCartTotal(user.cart);
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    res.json({
      itemCount: user.cart.length,
      subtotal,
      shipping,
      tax,
      total,
      items: user.cart
    });
  } catch (error) {
    console.error('Cart summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate cart total
function calculateCartTotal(cart) {
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

module.exports = router;
