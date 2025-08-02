# Beefree SDK Simple Schema Demo

A minimalist demo showcasing the integration between Anthropic's Claude AI and Beefree's SDK for email template creation.

## Overview

This demo demonstrates a streamlined workflow for creating email templates:

1. **User Input**: Describe the email you want to create in natural language
2. **AI Generation**: Anthropic's Claude generates a simple JSON template
3. **Template Conversion**: Beefree API converts the simple JSON to full JSON format
4. **Builder Integration**: Open the generated template in Beefree's visual editor

## Features

- 🤖 **AI-Powered**: Uses Anthropic's Claude to generate email templates from natural language descriptions
- 🎨 **Visual Editor**: Seamlessly opens generated templates in Beefree's drag-and-drop builder
- 🔄 **Template Conversion**: Automatically converts simple JSON to full Beefree-compatible JSON
- 💾 **Local Storage**: Templates are stored locally for easy access

## Prerequisites

- Node.js (v14 or higher)
- npm
- Anthropic API key
- Beefree API key

## Setup

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API keys**:
   Create a `credentials.js` file in the project root with your API keys:
   ```javascript
   const credentials = {
       client_id: "your_beefree_client_id",
       client_secret: "your_beefree_client_secret", 
       beefree_api_key: "your_beefree_api_key",
       anthropic_api_key: "your_anthropic_api_key"
   };
   
   module.exports = credentials;
   ```

4. **Start the demo**:
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   node proxy-server.js
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## How to Use

1. **Describe Your Email**: In the chat interface, describe the email you want to create (e.g., "Create a welcome email for a new customer with a discount offer")

2. **AI Generation**: The AI will generate a simple JSON template based on your description

3. **Template Conversion**: The system automatically converts the simple JSON to full Beefree-compatible JSON

4. **Open in Builder**: Click "Edit your design in the builder" to open the template in Beefree's visual editor

5. **Customize**: Use Beefree's drag-and-drop interface to customize your email design

## API Endpoints

The proxy server provides the following endpoints:

- `POST /api/anthropic` - Calls Anthropic's Claude API
- `POST /api/beefree/simple-to-full` - Converts simple JSON to full JSON using Beefree API
- `GET /api/health` - Health check endpoint

## File Structure

```
simple-schema-concept/
├── index.html          # Main demo interface
├── builder.html        # Beefree SDK integration
├── proxy-server.js     # API proxy server
├── credentials.js      # API keys configuration
├── package.json        # Dependencies
├── start.sh           # Startup script
└── README.md          # This file
```

## Technical Details

### Simple JSON Schema

The AI generates templates using the Beefree SDK simple template schema:

```json
{
  "template": {
    "type": "email",
    "rows": [
      {
        "name": "Row Name", 
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "title",
                "content": "Your title here"
              }
            ]
          }
        ]
      }
    ],
    "settings": {
      "linkColor": "#0066CC",
      "background-color": "#ffffff",
      "contentAreaBackgroundColor": "#ffffff",
      "width": 600
    },
    "metadata": {
      "title": "Email Template",
      "description": "Generated email template",
      "subject": "Your Email Subject",
      "preheader": "Email preheader text"
    }
  }
}
```

### Supported Module Types

- `title` - Email titles and headings
- `paragraph` - Text content
- `button` - Call-to-action buttons
- `image` - Images and graphics
- `divider` - Visual separators
- `html` - Custom HTML content
- `list` - Bulleted or numbered lists
- `menu` - Navigation menus
- `icons` - Social media icons

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API keys are correctly configured in `credentials.js`
2. **Port Already in Use**: Change the port in `proxy-server.js` if port 3000 is occupied
3. **CORS Issues**: The proxy server handles CORS for local development

### Getting API Keys

- **Anthropic API Key**: Get from [Anthropic Console](https://console.anthropic.com/)
- **Beefree API Key**: Get from [Beefree Dashboard](https://app.getbee.io/)

## License

This demo is provided as-is for educational purposes.

## Support

For issues related to:
- **Beefree SDK**: Check the [Beefree Documentation](https://docs.beefree.io/)
- **Anthropic API**: Check the [Anthropic Documentation](https://docs.anthropic.com/) 