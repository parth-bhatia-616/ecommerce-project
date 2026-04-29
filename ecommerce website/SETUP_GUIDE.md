# eCommerce Website - Complete Setup & Installation Guide

## Project Complete! ✅

Your beginner-friendly eCommerce project has been fully created with all required modules and functionality.

---

## What's Included

### ✅ Complete Feature Set
- **Registration Module** - User signup with name, email, password
- **Login System** - Authentication with session management
- **Product Listing** - Display products with prices
- **Shopping Cart** - Add/remove products, view cart, calculate totals
- **Clean UI** - Professional styling with CSS
- **Form Validation** - JavaScript validation on forms

### ✅ All Required Files
```
Project Folder/
├── WebContent/                 (Web resources)
│   ├── index.jsp              (Redirect to login)
│   ├── registration.jsp       (Registration form)
│   ├── login.jsp              (Login form)
│   ├── home.jsp               (Product list)
│   ├── cart.jsp               (Shopping cart)
│   ├── removeFromCart.jsp     (Remove from cart handler)
│   ├── css/
│   │   └── style.css          (Professional UI styling)
│   ├── js/
│   │   └── script.js          (Form validation)
│   └── WEB-INF/
│       └── web.xml            (Application configuration)
│
├── src/                        (Java source code)
│   ├── DBConnection.java      (Database connectivity)
│   └── servlets/
│       ├── RegistrationServlet.java
│       ├── LoginServlet.java
│       ├── AddToCartServlet.java
│       └── LogoutServlet.java
│
└── database/
    └── schema.sql             (Database setup with sample data)
```

---

## 🚀 QUICK START (5 Steps)

### Step 1: Create MySQL Database

```bash
# Start MySQL (if not already running)
mysql.server start

# Create database and tables
mysql -u root -p < database/schema.sql

# Verify
mysql -u root
USE ecommerce_db;
SHOW TABLES;
EXIT;
```

**Default MySQL Credentials:**
- Username: `root`
- Password: (empty)
- Database: `ecommerce_db`
- Port: `3306`

### Step 2: Update Database Credentials (If Needed)

Edit: `src/DBConnection.java`

```java
private static final String DB_URL = "jdbc:mysql://localhost:3306/ecommerce_db";
private static final String DB_USER = "root";      // Change if different
private static final String DB_PASSWORD = "";      // Add password if set
```

### Step 3: Download MySQL JDBC Driver

1. Download from: https://dev.mysql.com/downloads/connector/j/
2. Choose: **mysql-connector-java-8.0.33.tar.gz** (or latest)
3. Extract and copy **mysql-connector-java-8.0.33.jar**

### Step 4: Deploy to Tomcat

**Using Eclipse (Easiest for Beginners):**

1. Open **Eclipse IDE**
2. File → New → Dynamic Web Project
3. Project Name: `ecommerce`
4. Target Runtime: **Apache Tomcat v9.0**
5. Click "Finish"
6. Copy all files from your project to Eclipse project:
   - `src/` files → Eclipse `src/` folder
   - `WebContent/` files → Eclipse `WebContent/` folder
7. Right-click project → **Properties**
8. Java Build Path → Libraries → **Add External JAR**
9. Select `mysql-connector-java-8.0.33.jar`
10. Right-click project → **Run As** → **Run on Server**
11. Select **Apache Tomcat v9.0** → Finish

**Using Tomcat Directly:**

```bash
# Create application directory
mkdir /Library/Tomcat/webapps/ecommerce

# Copy files
cp -r WebContent/* /Library/Tomcat/webapps/ecommerce/
mkdir -p /Library/Tomcat/webapps/ecommerce/WEB-INF/classes
cp -r src/* /Library/Tomcat/webapps/ecommerce/WEB-INF/classes/

# Add MySQL JDBC Driver
cp mysql-connector-java-8.0.33.jar /Library/Tomcat/lib/

# Compile Java files
cd /Library/Tomcat/webapps/ecommerce/WEB-INF/classes/
javac -cp /Library/Tomcat/lib/mysql-connector-java-8.0.33.jar *.java servlets/*.java
```

### Step 5: Start & Access

**Start Tomcat:**
```bash
# Mac/Linux
/Library/Tomcat/bin/startup.sh

# Windows
C:\Apache\Tomcat\bin\startup.bat
```

**Open in Browser:**
```
http://localhost:8080/ecommerce/
```

---

## 📚 Complete Usage Guide

### User Registration
1. Page loads → Redirects to **login.jsp**
2. Click "Register here" link
3. Fill form:
   - Name: Your full name
   - Email: Valid email address
   - Password: Any password
4. Click "Register" button
5. Success → Redirected to login page

### User Login
1. Enter registered email
2. Enter password
3. Click "Login"
4. Success → Redirected to **home.jsp with products**

### Browsing Products
1. Home page displays 6 sample products
2. Each shows: Product name, Price
3. Click "Add to Cart" for any product

### Shopping Cart
1. Click "View Cart" button (top right)
2. See: All cart items, quantities, prices
3. Total price calculated automatically
4. Click "Remove" to delete item
5. Click "Continue Shopping" to return

### Logout
1. Click "Logout" button
2. Session ends → Redirected to login page

---

## 🗄️ Database Details

### Tables Created

**`users` Table**
```sql
- user_id      INT (Primary Key, Auto Increment)
- name         VARCHAR(100)
- email        VARCHAR(100) UNIQUE
- password     VARCHAR(255)
- created_at   TIMESTAMP
```

**`products` Table**
```sql
- product_id   INT (Primary Key, Auto Increment)
- product_name VARCHAR(100)
- price        DECIMAL(10, 2)
- description  VARCHAR(255)
- created_at   TIMESTAMP
```

**`cart` Table**
```sql
- cart_id      INT (Primary Key, Auto Increment)
- user_id      INT (Foreign Key)
- product_id   INT (Foreign Key)
- quantity     INT (Default 1)
- added_at     TIMESTAMP
```

### Sample Data Pre-loaded

The database automatically includes these products:

| Product | Price |
|---------|-------|
| Laptop | $999.99 |
| Mouse | $29.99 |
| Keyboard | $79.99 |
| Monitor | $299.99 |
| Headphones | $149.99 |
| USB Cable | $9.99 |

**To add more products:**
```sql
INSERT INTO products (product_name, price, description) 
VALUES ('Your Product', 99.99, 'Description here');
```

---

## 📝 Code Structure Overview

### DBConnection.java
```java
- Manages database connections
- Uses JDBC to connect MySQL
- Loaded automatically when servlets start
- Exception handling for connection errors
```

### RegistrationServlet.java
```java
- URL: /register
- Method: POST
- Gets: name, email, password from form
- Validates: All fields required
- Stores: User data in database
- Checks: Email not already registered
```

### LoginServlet.java
```java
- URL: /login
- Method: POST
- Gets: email, password from form
- Validates: Credentials against database
- Creates: Session (30 min timeout)
- Stores: user_id, user_name in session
```

### AddToCartServlet.java
```java
- URL: /addToCart
- Method: POST
- Gets: product_id from form
- Checks: User is logged in
- Updates: Quantity if product exists
- Inserts: New cart item if not exists
```

### JSP Pages
```
index.jsp         → Redirects to login
registration.jsp  → Registration form
login.jsp         → Login form
home.jsp          → Products list (requires login)
cart.jsp          → Shopping cart (requires login)
removeFromCart.jsp → Removes item from cart
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
**Solutions:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check DB credentials in `src/DBConnection.java`
3. Verify database exists: `USE ecommerce_db;`
4. Check port 3306 is available: `netstat -an | grep 3306`

### Issue: "JDBC Driver not found"
**Solutions:**
1. Copy JAR to Tomcat/lib folder
2. Verify filename: `mysql-connector-java-8.0.33.jar`
3. Restart Tomcat server
4. If using Eclipse, add JAR to Build Path

### Issue: "Pages show 404 error"
**Solutions:**
1. Check application name is "ecommerce"
2. Verify JSP files are in WebContent/
3. Clear browser cache (Cmd+Shift+Delete)
4. Restart Tomcat
5. Delete Tomcat work folder

### Issue: "Login doesn't work"
**Solutions:**
1. Verify user was registered (check MySQL users table)
2. Check exact email/password match
3. Ensure cookies are enabled in browser
4. Try different browser

### Issue: "Session expires immediately"
**Solutions:**
1. Check web.xml session configuration
2. Verify Tomcat is configured correctly
3. Ensure JSESSIONID cookie is created
4. Check maximum inactive interval setting

---

## 🔍 Test Checklist

Before submitting your project:

- [ ] **Registration**
  - [ ] Can register new user
  - [ ] Email validation works
  - [ ] Duplicate email prevented
  - [ ] Redirects to login on success

- [ ] **Login**
  - [ ] Can login with correct credentials
  - [ ] Login fails with wrong password
  - [ ] Session created successfully
  - [ ] Session data visible (username display)

- [ ] **Products**
  - [ ] All 6 products display
  - [ ] Prices show correctly
  - [ ] Add to Cart button works

- [ ] **Shopping Cart**
  - [ ] Products add successfully
  - [ ] Quantity increments for duplicates
  - [ ] Remove button deletes items
  - [ ] Total price calculates correctly

- [ ] **Logout**
  - [ ] Logout button works
  - [ ] Session destroyed
  - [ ] Redirects to login
  - [ ] Cannot access home without login

- [ ] **UI/UX**
  - [ ] Pages load without errors
  - [ ] Forms validate on submit
  - [ ] Error messages display
  - [ ] Navigation links work

---

## 💡 Learning Concepts Covered

### Java/Servlets
- Servlet lifecycle (init, service, destroy)
- Request/response handling
- Form data processing
- Session management
- Exception handling

### JSP
- Server-side page rendering
- Form creation and submission
- SQL result iteration
- Dynamic HTML generation
- Session attribute access

### Database
- JDBC connectivity
- SQL SELECT, INSERT, UPDATE, DELETE
- Database relationships (Foreign Keys)
- Connection pooling basics
- Error handling

### Web Technologies
- HTML form elements
- CSS styling and layout
- JavaScript form validation
- HTTP GET/POST
- Cookies and sessions

---

## 🎯 Career Skills Practiced

✅ Full-stack web development
✅ Backend Java programming
✅ Database design and SQL
✅ Frontend HTML/CSS/JavaScript
✅ Web server deployment
✅ Software architecture
✅ Debugging techniques
✅ Problem-solving

---

## 📈 How to Enhance This Project

### Simple Enhancements (1-2 hours)
- [ ] Add product search feature
- [ ] Sort products by price
- [ ] Display product quantity in inventory
- [ ] Add success messages

### Medium Enhancements (3-5 hours)
- [ ] Password hashing (MD5/BCrypt)
- [ ] Order history page
- [ ] Product categories
- [ ] Email confirmation on registration
- [ ] Admin product management

### Advanced Enhancements (5+ hours)
- [ ] Payment gateway integration (Stripe)
- [ ] User profile management
- [ ] Product ratings and reviews
- [ ] Wishlist functionality
- [ ] Inventory management
- [ ] Automated email notifications

---

## 📞 Support & Help

### If stuck on setup:
1. Verify all prerequisites installed
2. Check file paths are correct
3. Review Tomcat logs in `logs/` folder
4. Restart all services
5. Clear browser cache

### Check These Files for Errors:
- `$TOMCAT/logs/catalina.out` (Tomcat errors)
- Browser console (JavaScript errors)
- MySQL error log

### Verify Installation:
```bash
# Check Java
java -version

# Check MySQL
mysql --version

# Check Tomcat
ls /Library/Tomcat/bin/

# Check JDBC
ls /Library/Tomcat/lib/mysql-connector-*
```

---

## 📦 Deployment Checklist

Before final submission:

- [ ] All Java files compile without errors
- [ ] All JSP pages accessible
- [ ] Database tables created
- [ ] Sample data loaded
- [ ] MySQL JDBC driver installed
- [ ] web.xml configured correctly
- [ ] All links working
- [ ] Forms validating
- [ ] No console errors
- [ ] Application runs on Tomcat

---

## 🎓 Next Steps After Completion

1. **Learn Spring Boot** - Modern Java framework
2. **Add API Layer** - RESTful web services
3. **Learn JPA/Hibernate** - ORM framework
4. **Frontend Framework** - React/Angular
5. **Deploy to Cloud** - AWS/Heroku
6. **Add Testing** - JUnit/Selenium

---

## 📞 File Summary

| File | Lines | Purpose |
|------|-------|---------|
| DBConnection.java | 25 | Database connection |
| RegistrationServlet.java | 55 | User registration |
| LoginServlet.java | 65 | User authentication |
| AddToCartServlet.java | 75 | Cart management |
| LogoutServlet.java | 20 | Session termination |
| home.jsp | 80 | Product listing |
| cart.jsp | 120 | Shopping cart |
| style.css | 280 | UI styling |
| script.js | 50 | Form validation |
| schema.sql | 50 | Database setup |
| web.xml | 25 | Configuration |

**Total: ~700+ lines of code**

---

## 🎯 Project Summary

**Technology Stack:**
- Core Java & Servlets
- JSP (Java Server Pages)
- MySQL Database
- JDBC Connectivity
- HTML, CSS, JavaScript
- Apache Tomcat Server

**Key Features:**
- User authentication
- Product catalog
- Shopping cart
- Session management
- Database persistence

**Learning Value:**
- Web development fundamentals
- Database connectivity
- Server-side programming
- Frontend-backend integration

**Time to Complete:**
- Setup: 30-45 minutes
- Understanding: 2-3 hours
- Customization: 1-2 hours

---

## ✅ You're All Set!

Your eCommerce project is **100% complete** and **ready to run**!

Follow the **5-step Quick Start** guide at the top of this document.

**Happy Coding! 🚀**

---

*Created for: Beginner Java Students*
*Level: Beginner-Friendly*
*Date: 2026*
*Updated: 9 Feb 2026*
