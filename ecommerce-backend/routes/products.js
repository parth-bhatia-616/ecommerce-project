const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const router = express.Router();

// Sample product data for seeding
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 1999.90,
    category: "electronics",
    brand: "AudioTech",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    stock: 50,
    features: ["Active Noise Cancellation", "30-hour battery life", "Bluetooth 5.0", "Premium sound quality"],
    specifications: {
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Weight": "250g",
      "Driver Size": "40mm"
    },
    tags: ["wireless", "bluetooth", "headphones", "audio"]
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life.",
    price: 2999.90,
    category: "electronics",
    brand: "FitTech",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
    stock: 30,
    features: ["Heart rate monitoring", "GPS tracking", "Water resistant", "7-day battery"],
    specifications: {
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      "Display": "1.4\" AMOLED",
      "GPS": "Built-in"
    },
    tags: ["smartwatch", "fitness", "gps", "health"]
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt, perfect for everyday wear.",
    price: 299.90,
    category: "clothing",
    brand: "EcoWear",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    stock: 100,
    features: ["100% organic cotton", "Sustainable", "Machine washable", "Multiple colors"],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular",
      "Care": "Machine washable",
      "Origin": "Fair trade certified"
    },
    tags: ["cotton", "organic", "t-shirt", "sustainable"]
  },
  {
    name: "Professional Yoga Mat",
    description: "Extra thick, non-slip yoga mat with alignment markers for perfect poses.",
    price: 499.90,
    category: "sports",
    brand: "YogaPro",
    images: ["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400"],
    stock: 75,
    features: ["Extra thick cushioning", "Non-slip surface", "Alignment markers", "Eco-friendly materials"],
    specifications: {
      "Thickness": "6mm",
      "Material": "TPE eco-friendly",
      "Dimensions": "183cm x 61cm",
      "Weight": "1.2kg"
    },
    tags: ["yoga", "fitness", "exercise", "mat"]
  },
  {
    name: "JavaScript Programming Book",
    description: "Comprehensive guide to modern JavaScript programming for beginners and advanced developers.",
    price: 399.90,
    category: "books",
    brand: "TechBooks",
    images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"],
    stock: 60,
    features: ["500+ pages", "Modern ES6+", "Real projects", "Expert author"],
    specifications: {
      "Pages": "512",
      "Language": "English",
      "Format": "Paperback",
      "ISBN": "978-1234567890"
    },
    tags: ["programming", "javascript", "coding", "development"]
  },
  {
    name: "Smart Home Security Camera",
    description: "HD security camera with night vision, motion detection, and two-way audio.",
    price: 1499.90,
    category: "electronics",
    brand: "SecureHome",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    stock: 40,
    features: ["1080p HD video", "Night vision", "Motion detection", "Two-way audio"],
    specifications: {
      "Resolution": "1080p HD",
      "Night Vision": "30ft",
      "Storage": "Cloud + SD card",
      "Connectivity": "WiFi"
    },
    tags: ["security", "camera", "smart home", "wifi"]
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 349.90,
    category: "sports",
    brand: "HydroMax",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"],
    stock: 120,
    features: ["24-hour cold retention", "12-hour hot retention", "BPA-free", "Leak-proof"],
    specifications: {
      "Capacity": "750ml",
      "Material": "304 Stainless Steel",
      "Insulation": "Double-wall vacuum",
      "Height": "26cm"
    },
    tags: ["water bottle", "insulated", "stainless steel", "hydration"]
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision gaming mouse with RGB lighting and customizable buttons.",
    price: 799.90,
    category: "electronics",
    brand: "GamePro",
    images: ["https://images.unsplash.com/photo-1527814050087-379381547996?w=400"],
    stock: 55,
    features: ["16000 DPI sensor", "RGB lighting", "6 programmable buttons", "Wireless charging"],
    specifications: {
      "DPI": "16000",
      "Buttons": "6 programmable",
      "Battery": "70 hours",
      "Connection": "2.4GHz wireless"
    },
    tags: ["gaming", "mouse", "wireless", "rgb"]
  },
  {
    name: "Wireless Earbuds",
    description: "Premium true wireless earbuds with immersive sound and active noise cancellation.",
    price: 2499.00,
    category: "electronics",
    brand: "AudioTech",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"],
    stock: 80,
    features: ["Active Noise Cancellation", "Bluetooth 5.2", "Water resistant", "24h battery"],
    specifications: { "Battery": "24 hours", "Bluetooth": "5.2" },
    tags: ["earbuds", "wireless", "audio"]
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof bluetooth speaker with deep bass and 360-degree sound.",
    price: 3299.00,
    category: "electronics",
    brand: "SoundMax",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"],
    stock: 45,
    features: ["IPX7 Waterproof", "360° Sound", "12h Playtime"],
    specifications: { "Playtime": "12 hours", "Waterproof": "IPX7" },
    tags: ["speaker", "bluetooth", "audio"]
  },
  {
    name: "Smartwatch Pro",
    description: "Advanced smartwatch with AMOLED display, heart rate monitor, and built-in GPS.",
    price: 4999.00,
    category: "electronics",
    brand: "TechWear",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400"],
    stock: 60,
    features: ["AMOLED Display", "Heart Rate Monitor", "Built-in GPS"],
    specifications: { "Display": "AMOLED", "Battery": "14 Days" },
    tags: ["smartwatch", "fitness", "wearable"]
  },
  {
    name: "Men's Classic Hoodie",
    description: "Comfortable and warm cotton-blend hoodie perfect for everyday casual wear.",
    price: 1799.00,
    category: "clothing",
    brand: "UrbanStyle",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"],
    stock: 120,
    features: ["Cotton-blend", "Front pocket", "Drawstring hood"],
    specifications: { "Material": "Cotton Blend", "Fit": "Regular" },
    tags: ["hoodie", "men", "clothing"]
  },
  {
    name: "Women's Comfort Sneakers",
    description: "Lightweight and breathable sneakers designed for all-day comfort and style.",
    price: 2999.00,
    category: "clothing",
    brand: "StepFlex",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
    stock: 90,
    features: ["Breathable mesh", "Cushioned sole", "Lightweight"],
    specifications: { "Material": "Mesh", "Sole": "Rubber" },
    tags: ["sneakers", "shoes", "women"]
  },
  {
    name: "Classic Denim Jacket",
    description: "Timeless blue denim jacket with button closure and chest pockets.",
    price: 2499.00,
    category: "clothing",
    brand: "DenimCo",
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400"],
    stock: 50,
    features: ["100% Cotton", "Button closure", "Classic fit"],
    specifications: { "Material": "Denim", "Care": "Machine wash" },
    tags: ["jacket", "denim", "fashion"]
  },
  {
    name: "Modern Table Lamp",
    description: "Minimalist table lamp with adjustable brightness and warm LED light.",
    price: 1299.00,
    category: "home",
    brand: "Lumiere",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"],
    stock: 40,
    features: ["Adjustable brightness", "LED technology", "Minimalist design"],
    specifications: { "Power": "10W", "Light": "Warm White" },
    tags: ["lamp", "home", "lighting"]
  },
  {
    name: "Premium Coffee Maker",
    description: "Programmable drip coffee maker with glass carafe and keep-warm function.",
    price: 5499.00,
    category: "home",
    brand: "BrewMaster",
    images: ["https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400"],
    stock: 25,
    features: ["Programmable timer", "Keep-warm plate", "Reusable filter"],
    specifications: { "Capacity": "12 Cups", "Power": "900W" },
    tags: ["coffee", "kitchen", "appliance"]
  },
  {
    name: "Laptop Travel Backpack",
    description: "Durable and water-resistant backpack with padded laptop sleeve and multiple compartments.",
    price: 1999.00,
    category: "other",
    brand: "TravelGear",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    stock: 75,
    features: ["Water-resistant", "Fits 15.6 inch laptop", "USB charging port"],
    specifications: { "Material": "Polyester", "Capacity": "25L" },
    tags: ["backpack", "bag", "travel"]
  },
  {
    name: "Vintage Aviator Sunglasses",
    description: "Classic aviator sunglasses with UV protection and polarized lenses.",
    price: 1499.00,
    category: "other",
    brand: "SunShade",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400"],
    stock: 100,
    features: ["UV400 Protection", "Polarized", "Metal frame"],
    specifications: { "Lens": "Polarized", "Frame": "Metal" },
    tags: ["sunglasses", "accessories", "fashion"]
  },
  {
    name: "4K Action Camera",
    description: "Waterproof 4K action camera with stabilization and wide-angle lens.",
    price: 8999.00,
    category: "electronics",
    brand: "CamPro",
    images: ["https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=400"],
    stock: 35,
    features: ["4K 60fps Video", "Waterproof up to 40m", "Hyper-Smooth Stabilization"],
    specifications: { "Resolution": "4K", "Waterproof": "40m" },
    tags: ["camera", "action", "electronics"]
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with tactile blue switches and aluminum frame.",
    price: 3499.00,
    category: "electronics",
    brand: "KeyTech",
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=400"],
    stock: 80,
    features: ["Blue Switches", "RGB Backlight", "Aluminum Frame"],
    specifications: { "Switches": "Blue", "Connection": "USB" },
    tags: ["keyboard", "gaming", "pc"]
  },
  {
    name: "Premium Leather Wallet",
    description: "Genuine leather bifold wallet with RFID protection and multiple card slots.",
    price: 1299.00,
    category: "other",
    brand: "LuxLeather",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"],
    stock: 150,
    features: ["RFID Protection", "Genuine Leather", "8 Card Slots"],
    specifications: { "Material": "Leather", "Type": "Bifold" },
    tags: ["wallet", "leather", "accessories"]
  },
  {
    name: "Winter Puffer Jacket",
    description: "Warm and lightweight puffer jacket perfect for extreme winter conditions.",
    price: 4599.00,
    category: "clothing",
    brand: "WinterGear",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"],
    stock: 65,
    features: ["Water-resistant", "Insulated", "Detachable hood"],
    specifications: { "Material": "Polyester", "Season": "Winter" },
    tags: ["jacket", "winter", "clothing"]
  },
  {
    name: "Pro Running Shoes",
    description: "High-performance running shoes with responsive cushioning and breathable upper.",
    price: 5999.00,
    category: "clothing",
    brand: "PumaTech",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    stock: 110,
    features: ["Responsive Cushioning", "Breathable Mesh", "Durable Outsole"],
    specifications: { "Use": "Running", "Material": "Mesh" },
    tags: ["shoes", "running", "sports"]
  },
  {
    name: "Minimalist Wall Clock",
    description: "Silent non-ticking modern wall clock with wooden finish.",
    price: 899.00,
    category: "home",
    brand: "TimeDecor",
    images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400"],
    stock: 45,
    features: ["Silent mechanism", "Wooden finish", "Easy to read"],
    specifications: { "Diameter": "30cm", "Battery": "1 AA" },
    tags: ["clock", "decor", "home"]
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug perfect for your morning coffee or tea.",
    price: 499.00,
    category: "home",
    brand: "ArtisanCraft",
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400"],
    stock: 200,
    features: ["Handcrafted", "Microwave safe", "Dishwasher safe"],
    specifications: { "Capacity": "350ml", "Material": "Ceramic" },
    tags: ["mug", "coffee", "home"]
  },
  {
    name: "Adjustable Dumbbell Set",
    description: "Space-saving adjustable dumbbells for full-body home workouts.",
    price: 6499.00,
    category: "sports",
    brand: "FitHome",
    images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400"],
    stock: 25,
    features: ["Adjustable weight", "Space-saving", "Durable iron"],
    specifications: { "Max Weight": "24kg", "Material": "Cast Iron" },
    tags: ["dumbbells", "fitness", "sports"]
  },
  {
    name: "Professional Tennis Racket",
    description: "Lightweight carbon fiber tennis racket for advanced players.",
    price: 7999.00,
    category: "sports",
    brand: "CourtMaster",
    images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400"],
    stock: 40,
    features: ["Carbon Fiber Frame", "Shock absorption", "Pre-strung"],
    specifications: { "Weight": "280g", "Head Size": "100 sq in" },
    tags: ["tennis", "racket", "sports"]
  },
  {
    name: "Luxury Men's Perfume",
    description: "Long-lasting Eau de Parfum with woody and spicy aromatic notes.",
    price: 3499.00,
    category: "beauty",
    brand: "ScentVibe",
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400"],
    stock: 85,
    features: ["Long-lasting", "Premium spray", "Woody notes"],
    specifications: { "Volume": "100ml", "Type": "EDP" },
    tags: ["perfume", "fragrance", "beauty"]
  },
  {
    name: "Bestseller Fiction Novel",
    description: "The gripping new mystery thriller that everyone is talking about.",
    price: 499.00,
    category: "books",
    brand: "PenguinBooks",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"],
    stock: 300,
    features: ["Paperback edition", "400 pages", "Award-winning"],
    specifications: { "Genre": "Thriller", "Format": "Paperback" },
    tags: ["book", "novel", "reading"]
  },
  {
    name: "Noise-Isolating Earbuds",
    description: "Wired in-ear headphones with deep bass and tangle-free cord.",
    price: 899.00,
    category: "electronics",
    brand: "AudioTech",
    images: ["https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400"],
    stock: 120,
    features: ["Deep Bass", "In-line Mic", "Tangle-free cable"],
    specifications: { "Connection": "3.5mm Jack", "Type": "In-ear" },
    tags: ["earbuds", "wired", "audio"]
  }
];

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.brand) {
      filter.brand = new RegExp(req.query.brand, 'i');
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort options
    const sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      
      if (['price', 'name', 'createdAt', 'ratings.average'].includes(sortField)) {
        sort[sortField] = sortOrder;
      }
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/categories
// @desc    Get all categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/brands
// @desc    Get all brands
// @access  Public
router.get('/meta/brands', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, validateProduct, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products/seed
// @desc    Seed database with sample products (Public for testing)
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    
    res.json({
      message: 'Database seeded with sample products',
      count: sampleProducts.length
    });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
