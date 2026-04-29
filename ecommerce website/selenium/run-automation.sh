#!/bin/bash

echo "🛒 eCommerce Website Automation Test"
echo "=================================="

# Check if Firefox is installed
if [ ! -d "/Applications/Firefox.app" ] && ! command -v firefox &> /dev/null; then
    echo "❌ Firefox not found!"
    echo "Firefox is installed at /Applications/Firefox.app but not in PATH"
    echo "The test will still work with Selenium!"
fi

# Check if GeckoDriver exists
if ! command -v geckodriver &> /dev/null; then
    echo "❌ GeckoDriver not found!"
    echo "Install with: brew install geckodriver"
    exit 1
fi

echo "✅ Firefox found at /Applications/Firefox.app"
echo "✅ GeckoDriver found"

# Compile and run automation test
echo "🔧 Compiling automation test..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful"
    echo "🧪 Running automation test with Firefox..."
    mvn exec:java -Dexec.mainClass="EcommerceAutomation"
else
    echo "❌ Compilation failed"
fi
