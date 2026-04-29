# Vertex eCommerce Platform - Project Documentation

## 📖 Project Overview
Vertex is a modern, full-stack eCommerce application built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform provides a seamless shopping experience featuring secure user authentication, a persistent shopping cart, product catalog management, and user profile handling.

---

## 🛠 Technology Stack

### Frontend (Client-Side)
*   **Framework:** React 19 (TypeScript)
*   **Routing:** React Router v7
*   **Styling:** Custom CSS (`globals.css`) with responsive design
*   **State Management:** React Context API (`AppContext.tsx`)

### Backend (Server-Side)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose

### Security & Utilities
*   **Authentication:** JSON Web Tokens (JWT)
*   **Password Hashing:** Bcrypt.js
*   **API Security:** Helmet (HTTP headers) & express-rate-limit (DDoS prevention)
*   **Validation:** Express-Validator & Mongoose Schema Validation

---

## 🚀 Core Features

### 1. Secure User Authentication
*   **Registration & Login:** Robust form validation on both the client and server.
*   **JWT Integration:** Secure, stateless session management.
*   **Protected Routes:** Private API endpoints that verify token authenticity before returning data.

### 2. Product Catalog
*   **Massive Seeded Database:** A fully populated database featuring exactly 30 premium products spanning diverse categories (Electronics, Clothing, Home, Sports, Accessories, Books, Beauty).
*   **Product Listing:** Dynamic grid displaying available products, prices, and stock.
*   **Product Models:** Includes rich data types like Categories, Brands, and Descriptions.
*   **Filtering (API Level):** Backend endpoints designed to filter, search, and sort products (now supporting up to 50 items per page to eliminate pagination friction).

### 3. AI-Driven Product Recommendations ("Recommended for You")
*   **What it is doing:** Intelligently predicting and suggesting 3 highly relevant products to the user to enhance cross-selling and user engagement.
*   **What is implemented:** A lightning-fast, frontend-based recommendation engine built directly into `Products.tsx`. It continuously monitors global state (`cartItems`, `products`, and `filters`) via the Context API, instantly updating suggestions without requiring slow backend network requests.
*   **How it chooses the recommendation:** 
    1. **Exclusion:** It first maps over the user's cart and rigorously excludes any products already inside the cart to prevent redundant recommendations.
    2. **Primary Priority (Cart-Based):** If the user has items in their cart, the algorithm selects the category of the *most recently added* item and recommends 3 new products from that exact same category.
    3. **Secondary Priority (Filter-Based):** If the cart is empty, it checks if the user has a category filter applied (e.g., browsing "Home" goods) and recommends 3 products from that category.
    4. **Fallback:** If the cart is empty and no filters are applied, it gracefully defaults to recommending the top 3 overall products in the catalog.
*   **Why it works this way:** This hierarchical logic prioritizes the user's immediate purchasing intent. By focusing on the most recent cart addition, the AI captures the user's current train of thought (e.g., if they just added a laptop, they likely want a laptop bag next). Building this on the frontend ensures it feels instantaneous ("zero-latency AI"), providing a premium, fluid shopping experience without the overhead of a heavy machine learning backend.

### 4. Persistent Shopping Cart
*   **Database-Backed Cart:** Cart data is stored in the user's MongoDB document, meaning their cart is preserved across sessions and devices.
*   **Cart Management:** Users can instantly add products, update item quantities, and remove items dynamically.
*   **Real-Time Totals:** Automatic calculation of subtotals and overall cart price.

### 5. User Profiles & Address Management
*   **Profile Dashboard:** Users can manage their personal information.
*   **Address Book:** Support for multiple saved addresses (Home, Work, Other) to streamline checkout.
*   **Order History:** Users can view their past orders, total money spent, and pending deliveries.

### 6. Order Processing
*   **Checkout Flow:** Conversion of a user's active cart into a finalized order.
*   **Order Tracking:** Order status updates (Pending, Shipped, Delivered).

---

## 📁 System Architecture

### Backend Endpoints
*   `POST /api/auth/register` - Create a new user account.
*   `POST /api/auth/login` - Authenticate user and issue JWT.
*   `GET /api/auth/me` - Fetch authenticated user profile and stats.
*   `GET /api/products` - Retrieve catalog of products.
*   `POST /api/cart/add` - Append product to user cart.
*   `DELETE /api/cart/remove/:productId` - Remove item from cart.
*   `POST /api/orders` - Generate a new order from cart contents.
*   `PUT /api/users/profile` - Update user personal info and addresses.

### Frontend Components
*   `Main.tsx` - The landing page and hero section.
*   `Navbar.tsx` - Responsive navigation bar with dynamic cart counts and user dropdowns.
*   `Products.tsx` & `ProductCard.tsx` - The catalog layout and individual item UI.
*   `Cart.tsx` - Interactive shopping cart interface.
*   `Profile.tsx` - User dashboard for history and settings.
*   `Login.tsx` & `Register.tsx` - Secure forms for access control.

---

## ⚙️ Running the Project

**1. Start the Database:**
Ensure MongoDB is running locally on `mongodb://localhost:27017`.

**2. Start the Backend:**
\`\`\`bash
cd ecommerce-backend
# Make sure .env is created with PORT=5001 and JWT_SECRET
npm install
npm run dev
\`\`\`

**3. Start the Frontend:**
\`\`\`bash
cd ecommerce-frontend
npm install
npm start
\`\`\`
The application will be accessible at `http://localhost:3000`.
