# 🚀 QUICK REFERENCE GUIDE

## START HERE! (5 Minutes to Running)

### Prerequisites Check
```bash
✅ Java JDK installed  → java -version
✅ MySQL installed      → mysql --version
✅ Tomcat installed     → ls /Library/Tomcat
```

### Step 1: Create Database (2 Minutes)
```bash
mysql -u root -p < database/schema.sql
```

### Step 2: Add JDBC Driver (1 Minute)
```bash
cp mysql-connector-java-8.0.33.jar /Library/Tomcat/lib/
```

### Step 3: Deploy Project (1 Minute)
**Using Eclipse:**
- File > New > Dynamic Web Project
- Name: "ecommerce"
- Target: Tomcat v9.0
- Copy all files

**OR Using Terminal:**
```bash
cp -r . /Library/Tomcat/webapps/ecommerce
cd /Library/Tomcat/webapps/ecommerce/WEB-INF/classes
javac -cp /Library/Tomcat/lib/mysql-connector-java-8.0.33.jar *.java servlets/*.java
```

### Step 4: Start (1 Minute)
```bash
/Library/Tomcat/bin/startup.sh
```

### Step 5: Access (Immediately)
```
http://localhost:8080/ecommerce/
```

---

## 🎯 USER FLOW

```
VISITOR
  ↓
[Login Page] ← index.jsp redirects here
  ↓
(New User?) → [Registration Page] → Database saves user → Back to Login
  ↓
(Existing User) → Enter credentials → LoginServlet validates
  ↓
  ✅ Valid → Create session → [Home Page - Products List]
  ❌ Invalid → Show error → Stay on Login
  ↓
[Home Page]
  ├─ Displays 6 products with prices
  ├─ "Add to Cart" button for each product
  └─ "View Cart" button in header
  ↓
[Add to Cart]
  └─ AddToCartServlet updates database
  └─ Quantity increments if product exists
  └─ New row added if product new
  ↓
[View Cart]
  ├─ Shows all products in cart
  ├─ Shows quantity per product
  ├─ Calculates subtotal per product
  ├─ Shows total price
  ├─ "Remove" button for each item
  └─ "Continue Shopping" button
  ↓
[Logout]
  └─ LogoutServlet clears session
  └─ Redirect to Login page
  └─ Cannot access cart anymore
```

---

## 📊 DATABASE RELATIONSHIPS

```
┌─────────────┐                    ┌──────────────┐
│   USERS     │                    │   PRODUCTS   │
├─────────────┤                    ├──────────────┤
│ user_id (PK)├────┐    ┌─────────┤ product_id(PK
│ name        │    │    │         │ product_name │
│ email       │    │    │         │ price        │
│ password    │    │    │         │ description  │
└─────────────┘    │    │         └──────────────┘
                   │    │
              ┌────┴────┴──────┐
              │     CART       │
              ├────────────────┤
              │ cart_id (PK)   │
              │ user_id (FK) ──┼──→ USERS
              │ product_id(FK)─┼──→ PRODUCTS
              │ quantity       │
              └────────────────┘
```

---

## 🔄 REQUEST-RESPONSE FLOW

### Registration
```
Client                     Server
  │                          │
  ├─→ POST /register ────────→│ RegistrationServlet
  │   (name, email, pwd)      │
  │                           ├─→ Validate inputs
  │                           │
  │                           ├─→ Check email exists
  │                           │   (SELECT * FROM users WHERE email=?)
  │                           │
  │                           ├─→ If not exists, insert user
  │                           │   (INSERT INTO users VALUES(...))
  │                           │
  │←─ 302 Redirect ───────────┤ Redirect to login.jsp
  │   (login.jsp)             │
  │                           │
  ├─→ GET login.jsp ─────────→│
  │                           ├─→ Return login form
  │←─ HTML page ──────────────┤
```

### Login
```
Client                     Server
  │                          │
  ├─→ POST /login ───────────→│ LoginServlet
  │   (email, password)       │
  │                           ├─→ Validate credentials
  │                           │
  │                           ├─→ Query DB
  │                           │   (SELECT * FROM users 
  │                           │    WHERE email=? AND pwd=?)
  │                           │
  │                           ├─→ If match found
  │                           │   ├─ session.setAttribute()
  │                           │   └─ Create session cookie
  │                           │
  │←─ 302 Redirect ───────────┤ Redirect to home.jsp
  │   (home.jsp)              │
  │                           │
  ├─→ GET home.jsp ──────────→│
  │   (with session cookie)   │
  │                           ├─→ Check session
  │                           ├─→ Load products from DB
  │                           │   (SELECT * FROM products)
  │                           ├─→ Generate HTML with products
  │←─ HTML page ──────────────┤
```

### Add to Cart
```
Client                     Server
  │                          │
  ├─→ POST /addToCart ───────→│ AddToCartServlet
  │   (product_id, session)   │
  │                           ├─→ Check session exists
  │                           │
  │                           ├─→ Get user_id from session
  │                           │
  │                           ├─→ Check if product in cart
  │                           │   (SELECT * FROM cart 
  │                           │    WHERE user_id=? AND product_id=?)
  │                           │
  │                           ├─→ If exists: UPDATE quantity++
  │                           │
  │                           ├─→ If not: INSERT new row
  │                           │
  │←─ 302 Redirect ───────────┤ Redirect to home.jsp
  │   (home.jsp?success=...)  │
  │                           │
  ├─→ GET home.jsp ──────────→│
  │   (with success message)  │
  │←─ HTML page ──────────────┤
```

---

## 💾 DATABASE QUERIES

### User Registration
```sql
-- Check if email exists
SELECT * FROM users WHERE email = 'user@email.com';

-- Insert new user
INSERT INTO users (name, email, password)
VALUES ('John Doe', 'john@email.com', 'password123');
```

### User Login
```sql
-- Validate credentials
SELECT user_id, name FROM users 
WHERE email = 'john@email.com' AND password = 'password123';
```

### Get Products
```sql
-- Display all products
SELECT product_id, product_name, price FROM products;
```

### Add to Cart
```sql
-- Check if product in cart
SELECT * FROM cart 
WHERE user_id = 1 AND product_id = 5;

-- Update quantity if exists
UPDATE cart SET quantity = quantity + 1 
WHERE user_id = 1 AND product_id = 5;

-- Insert if not exists
INSERT INTO cart (user_id, product_id, quantity)
VALUES (1, 5, 1);
```

### View Cart
```sql
-- Get all cart items with product details
SELECT c.cart_id, p.product_name, p.price, c.quantity
FROM cart c
JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = 1;
```

### Remove from Cart
```sql
-- Delete item from cart
DELETE FROM cart 
WHERE cart_id = 10 AND user_id = 1;
```

---

## 📁 FILE RELATIONSHIPS

```
index.jsp
  ↓
  └─ Redirects to login.jsp

login.jsp
  ├─ Links to registration.jsp
  └─ POST to /login servlet
      ↓
      ├─ RegistrationServlet.java
      │   └─ INSERT users table
      └─ LoginServlet.java
          └─ SELECT from users table
              ↓
              └─ Creates session
                  ↓
                  └─ home.jsp
                      ├─ SELECT from products table
                      ├─ POST form to /addToCart
                      │   ↓
                      │   └─ AddToCartServlet.java
                      │       ├─ SELECT/UPDATE/INSERT cart table
                      │       └─ Redirect to home.jsp
                      └─ Link to cart.jsp
                          ├─ SELECT from cart JOIN products
                          └─ DELETE from removeFromCart.jsp
                              ↓
                              └─ LogoutServlet.java
                                  └─ Invalidate session
                                      ↓
                                      └─ Back to login.jsp

All database access uses DBConnection.java
```

---

## 🔑 KEY CONCEPTS

### Sessions
```java
// Create session (in LoginServlet)
HttpSession session = request.getSession(true);
session.setAttribute("user_id", userId);
session.setAttribute("user_name", userName);

// Get session (in home.jsp)
Integer user_id = (Integer) session.getAttribute("user_id");
if (user_id == null) {
    // Not logged in, redirect to login
}

// Destroy session (in LogoutServlet)
session.invalidate();
```

### Prepared Statements (SQL Injection Prevention)
```java
// SAFE - Uses placeholders
String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, email);
pstmt.setString(2, password);
ResultSet rs = pstmt.executeQuery();

// UNSAFE - String concatenation (DON'T USE)
String sql = "SELECT * FROM users WHERE email = '" + email + "'"; // BAD!
```

### Database Transactions
```java
Connection conn = DBConnection.getConnection();

try {
    // Do something with database
    pstmt.executeUpdate();
    
    conn.close();
} catch (SQLException e) {
    // Handle error
    e.printStackTrace();
} finally {
    // Always close resources
    if (rs != null) rs.close();
    if (pstmt != null) pstmt.close();
    if (conn != null) conn.close();
}
```

---

## 🧪 TEST SCENARIOS

### Happy Path (Everything Works)
```
1. Register: Fill form → Success → Redirect to login ✅
2. Login: Enter credentials → Success → See products ✅
3. Browse: See 6 products ✅
4. Cart: Add item → See in cart ✅
5. Quantity: Add same item → Quantity increases ✅
6. Total: Calculate correctly ✅
7. Remove: Delete item → Cart updated ✅
8. Logout: End session → Login required ✅
```

### Error Scenarios
```
✅ Register with duplicate email → Error shown
✅ Login with wrong password → Error shown
✅ Access cart without login → Redirect to login
✅ Remove item from empty cart → Handle gracefully
✅ Database offline → Connection error shown
✅ JDBC driver missing → ClassNotFoundException
```

---

## 📈 PERFORMANCE NOTES

**Database Optimization:**
- indexes created on: user_id, product_id
- Foreign keys ensure referential integrity
- Prepared statements prevent SQL injection

**Caching Opportunities:**
- Products list (rarely changes)
- User sessions (built-in)
- Static resources (CSS, JS)

---

## ⚙️ CONFIGURATION REFERENCE

### web.xml default settings
```xml
<session-config>
    <tracking-mode>COOKIE</tracking-mode>
</session-config>
```

### Database defaults
```
Host: localhost
Port: 3306
User: root
Password: (empty)
Database: ecommerce_db
```

### Session timeout
```
30 minutes (1800 seconds)
Configured in LoginServlet
```

---

## 🐛 QUICK DEBUG CHECKLIST

When something doesn't work:

1. **Database Issue?**
   - ``mysql -u root -p``
   - ``USE ecommerce_db; SHOW TABLES;``

2. **JDBC Driver Issue?**
   - ``ls /Library/Tomcat/lib/mysql-connector*``

3. **Servlet Compilation Issue?**
   - ``cd /path/to/servlets``
   - ``javac -cp /path/to/jdbc.jar *.java``

4. **JSP Not Found?**
   - Check file in WebContent folder
   - Check spelling matches URL
   - Restart Tomcat

5. **Session Lost?**
   - Check cookies enabled in browser
   - Check web.xml session config
   - Check Tomcat session timeout

6. **Database Connection Lost?**
   - Check MySQL is running
   - Check credentials in DBConnection.java
   - Check firewall not blocking port 3306

---

## 📞 COMMON COMMANDS

```bash
# Start MySQL
mysql.server start

# Create database
mysql -u root -p < schema.sql

# Start Tomcat
/Library/Tomcat/bin/startup.sh

# Stop Tomcat
/Library/Tomcat/bin/shutdown.sh

# Check Tomcat logs
tail -f /Library/Tomcat/logs/catalina.out

# Compile Java
javac -cp libs/*.jar *.java

# Find process on port
lsof -i :8080
```

---

## ✅ DEPLOYMENT CHECKLIST

Before going live:

- [ ] Database created and populated
- [ ] JDBC driver in Tomcat/lib
- [ ] All Java files compiled
- [ ] web.xml configured
- [ ] JSP files in WebContent
- [ ] CSS/JS files in place
- [ ] Tomcat restarted
- [ ] Application accessible
- [ ] All features tested
- [ ] No console errors

---

## 🎯 SUCCESS INDICATORS

Your project works when:

✅ http://localhost:8080/ecommerce/ loads
✅ Can register new user
✅ Can login with credentials
✅ Can see 6 products
✅ Can add to cart
✅ Cart shows items and totals
✅ Can remove items
✅ Can logout
✅ No error messages
✅ Database responds

---

## 📊 TROUBLESHOOTING MATRIX

| Symptom | Check | Fix |
|---------|-------|-----|
| 404 error | URL spelling | Fix JSP filename |
| 500 error | Server logs | Check database |
| Can't login | DB connection | Verify MySQL |
| Session lost | Cookies | Enable cookies |
| Cart empty | DB query | Check join query |
| No products | Schema | Verify insert worked |

---

This is your quick reference. For full details, see SETUP_GUIDE.md

Good Luck! 🚀
