#!/bin/bash

echo "🚀 Starting Beefree SDK Partial Design Edits Demo"
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if credentials.js exists
if [ ! -f "credentials.js" ]; then
    echo "❌ credentials.js file not found!"
    echo "Please create a credentials.js file with your API keys:"
    echo ""
    echo "module.exports = {"
    echo "    anthropic_api_key: 'your_anthropic_key_here',"
    echo "    beefree_api_key: 'your_beefree_key_here'"
    echo "};"
    echo ""
    echo "You can copy credentials.example.js to credentials.js and update the values."
    exit 1
fi

echo "✅ credentials.js file found"

echo ""
echo "🌐 Starting the proxy server..."
echo "The demo will be available at: http://localhost:3000"
echo ""
echo "📝 How to use:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Click 'Upload Template' to load an existing JSON template"
echo "3. Click 'Save' in the Beefree editor to enable chat functionality"
echo "4. Use the chat to describe specific changes to your design"
echo "5. AI will apply your changes and update the design automatically"
echo ""
echo "💡 Example chat prompts:"
echo "- 'Rewrite the paragraph in row 3 column 2'"
echo "- 'Add another row promoting our latest blog posts'"
echo "- 'Change the color of the main heading to blue'"
echo "- 'Add a button after the first paragraph'"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the proxy server
node proxy-server.js 