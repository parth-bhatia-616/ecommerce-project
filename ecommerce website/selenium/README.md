# eCommerce Website Automation

This Selenium automation script is designed to test your eCommerce website with Firefox browser, similar to the Amazon automation example you provided.

## 📁 Files Created:
- `EcommerceAutomation.java` - Main automation script
- `pom.xml` - Maven configuration
- `run-automation.sh` - Execution script

## 🚀 How to Run:

### Method 1: Using the Script (Recommended)
```bash
cd "/Users/parthsmacbook/Desktop/project/test-automation-project/ecommerce website/selenium"
./run-automation.sh
```

### Method 2: Using Maven Directly
```bash
cd "/Users/parthsmacbook/Desktop/project/test-automation-project/ecommerce website/selenium"
mvn clean compile exec:java -Dexec.mainClass="EcommerceAutomation"
```

### Method 3: Manual Java Compilation
```bash
cd "/Users/parthsmacbook/Desktop/project/test-automation-project/ecommerce website/selenium"
javac -cp ".:$(find ~/.m2/repository -name 'selenium-java*.jar' | head -1)" EcommerceAutomation.java
java -cp ".:$(find ~/.m2/repository -name 'selenium-java*.jar' | head -1)" EcommerceAutomation
```

## 🎯 What the Script Does:

1. **✅ Launches Firefox** - Opens Firefox browser
2. **✅ Opens eCommerce Website** - Navigates to http://localhost:8080/ecommerce/
3. **✅ Validates Title** - Checks if page title contains "eCommerce" or "Shopping"
4. **✅ User Registration** - Fills registration form with test data
5. **✅ User Login** - Logs in with existing credentials
6. **✅ Product Browsing** - Counts products on the page
7. **✅ Add to Cart** - Adds first product to shopping cart
8. **✅ Cart Verification** - Checks cart contents
9. **✅ Page Scrolling** - Scrolls to bottom using JavaScript
10. **✅ Clean Exit** - Closes browser properly

## 🔧 Prerequisites:
- ✅ Firefox browser installed
- ✅ GeckoDriver installed (`brew install geckodriver`)
- ✅ Java 11 or higher
- ✅ Maven (for dependency management)

## 🌟 Features Similar to Amazon Example:
- **Implicit Wait** - 15 seconds for element detection
- **Window Management** - Maximizes browser window
- **Form Interaction** - Sends text to input fields
- **Button Clicking** - Clicks submit and action buttons
- **JavaScript Execution** - Scrolls page programmatically
- **Error Handling** - Try-catch for robust execution
- **Console Output** - Step-by-step progress messages

## 🎊 Perfect for Viva Demo:
- **Professional Structure** - Maven-based project
- **Clear Output** - Step-by-step execution logs
- **Real Website Testing** - Your actual eCommerce project
- **Firefox Integration** - Uses your preferred browser
- **Comprehensive Testing** - Covers all major user flows
