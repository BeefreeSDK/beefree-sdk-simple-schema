# Create AI-generated Emails in Beefree SDK with Anthropic's Claude AI and Simple Schema

This recipe demonstrates how to build an AI-powered email creation system that generates email templates using Anthropic's Claude API and converts them to full Beefree SDK templates using the Simple Schema format.

## Overview

This recipe covers:
1. **Simple Schema**: Understanding the template structure and unified schema
2. **Anthropic API Integration**: Structuring API calls and handling responses
3. **Frontend Integration**: Capturing user input and sending to AI
4. **Response Parsing**: Extracting and validating JSON from AI responses
5. **Beefree SDK Integration**: Converting simple templates to full templates and loading in the builder

## Prerequisites

- Node.js (v14 or higher)
- Anthropic API key
- Beefree SDK credentials
- Basic knowledge of JavaScript and Express.js

## Core Concepts

### 1. Simple Schema Structure

The Simple Schema is a simplified JSON format that makes it easy to generate email templates programmatically. It uses a hierarchical structure with templates, rows, columns, and modules.

#### Template Structure
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
                "text": "Your title here"
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

#### Supported Module Types
- `title` - Email titles and headings
- `paragraph` - Text content
- `button` - Call-to-action buttons
- `image` - Images and graphics
- `divider` - Visual separators
- `html` - Custom HTML content
- `list` - Bulleted or numbered lists
- `menu` - Navigation menus
- `icons` - Social media icons

### 2. Anthropic API Integration

#### API Call Structure
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-anthropic-api-key',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
});
```

#### Sample Request
```javascript
const prompt = `Use this email marketer's description of their dream email to design a stunning email that meets all of the requirements they outlined in their description. Here is the description: "${userDescription}". The email you deliver should meet industry best practices in email marketing and adhere to trending design tips from the best email designers in the industry. The final output should be in Beefree SDK's simple template schema format. 

IMPORTANT: Return ONLY a valid JSON object that follows this exact schema structure:

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
                "text": "Your title here"
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

Available module types: title, paragraph, button, image, divider, html, list, menu, icons

For each module type, include appropriate content. For example:
- title: {"type": "title", "text": "Your title text"}
- paragraph: {"type": "paragraph", "text": "Your paragraph text"}
- button: {"type": "button", "text": "Button text", "href": "https://example.com"}
- image: {"type": "image", "src": "https://example.com/image.jpg", "alt": "Image description"}
- divider: {"type": "divider"}
- html: {"type": "html", "html": "<p>Your HTML content</p>"}
- list: {"type": "list", "text": "List item text"}
- menu: {"type": "menu", "items": [{"text": "Link 1", "href": "https://example.com"}]}
- icons: {"type": "icons", "items": [{"type": "facebook", "href": "https://facebook.com"}]}

Do NOT invent any properties or structures that do not exist in this simple unified schema, strictly use only what is available here. The final email should be delivered in the response as a simple schema template. Make sure the JSON is valid and complete.`;
```

#### Sample Response
```json
{
  "id": "msg_01MVjrNK8LRDxEEFdWuHRdED",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-20250514",
  "content": [
    {
      "type": "text",
      "text": "```json\n{\n  \"template\": {\n    \"type\": \"email\",\n    \"rows\": [\n      {\n        \"name\": \"Header\",\n        \"columns\": [\n          {\n            \"weight\": 12,\n            \"modules\": [\n              {\n                \"type\": \"title\",\n                \"text\": \"Welcome to Our Service!\"\n              }\n            ]\n          }\n        ]\n      }\n    ],\n    \"settings\": {\n      \"linkColor\": \"#0066CC\",\n      \"background-color\": \"#ffffff\",\n      \"contentAreaBackgroundColor\": \"#ffffff\",\n      \"width\": 600\n    },\n    \"metadata\": {\n      \"title\": \"Welcome Email\",\n      \"description\": \"Welcome email template\",\n      \"subject\": \"Welcome to Our Service!\",\n      \"preheader\": \"Get started with our amazing service\"\n    }\n  }\n}\n```"
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 727,
    "output_tokens": 1809
  }
}
```

### 3. Frontend Integration

#### Capturing User Input
```javascript
function sendMessage() {
  if (isProcessing) return;
  
  const message = userInput.value.trim();
  if (!message) return;

  addMessage('user', message);
  userInput.value = '';
  userInput.style.height = 'auto';
  
  processEmailRequest(message);
}
```

#### Sending to Anthropic API
```javascript
async function processEmailRequest(userDescription) {
  isProcessing = true;
  sendButton.disabled = true;
  showTypingIndicator();

  try {
    // Create the prompt for Anthropic
    const prompt = `Use this email marketer's description of their dream email to design a stunning email that meets all of the requirements they outlined in their description. Here is the description: "${userDescription}". The email you deliver should meet industry best practices in email marketing and adhere to trending design tips from the best email designers in the industry. The final output should be in Beefree SDK's simple template schema format. 

    // ... rest of prompt as shown above ...

    // Call Anthropic API
    const response = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to generate email: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Anthropic API response:', data);
    
    // Continue with parsing...
  } catch (error) {
    console.error('Error processing email:', error);
    addMessage('assistant', `Sorry, there was an error creating your email: ${error.message}`);
  } finally {
    isProcessing = false;
    sendButton.disabled = false;
  }
}
```

### 4. Response Parsing

#### Extracting JSON from Response
```javascript
// Extract the text content from the response
let emailJsonText = '';
if (data.content && data.content.length > 0) {
  const textBlock = data.content.find(block => block.type === 'text');
  if (textBlock) {
    emailJsonText = textBlock.text;
  } else {
    throw new Error('No text content found in API response');
  }
} else {
  throw new Error('Invalid response structure from Anthropic API');
}

// Parse the JSON from the response
let emailJson;
try {
  // First try to find JSON in code blocks
  const jsonMatch = emailJsonText.match(/```json\s*([\s\S]*?)\s*```/) || 
                   emailJsonText.match(/```\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch) {
    emailJson = JSON.parse(jsonMatch[1]);
  } else {
    // If no code blocks, try to find JSON object in the text
    const jsonObjectMatch = emailJsonText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (jsonObjectMatch) {
      emailJson = JSON.parse(jsonObjectMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  }
  
  // Validate that we have the required template structure
  if (!emailJson.template || !emailJson.template.rows) {
    throw new Error('Invalid template structure - missing template or rows');
  }
  
  console.log('Parsed email JSON:', emailJson);
} catch (parseError) {
  console.error('JSON parsing error:', parseError);
  console.error('Raw response text:', emailJsonText);
  throw new Error(`Invalid JSON format in response: ${parseError.message}`);
}
```

#### Error Correction Loop
```javascript
// If Beefree CSAPI returns validation errors, send back to Anthropic for correction
if (!beefreeResponse.ok) {
  const errorData = await beefreeResponse.text();
  
  // Parse the error details for feedback
  let errorDetails = '';
  try {
    const errorJson = JSON.parse(errorData);
    errorDetails = errorJson.details || errorData;
  } catch (e) {
    errorDetails = errorData;
  }
  
  // Send error feedback to Anthropic for correction
  addMessage('assistant', 'I need to fix some formatting issues. Let me correct the template...');
  
  const correctionPrompt = `The previous template I generated had validation errors from the Beefree API. Here are the specific errors that need to be fixed:

${errorDetails}

The original user request was: "${userDescription}"

Please generate a corrected template that follows the exact Beefree SDK simple schema format. Here are the key corrections needed:

1. For image modules: use "src" instead of "url", "alt" is allowed
2. For title modules: use "text" instead of "content" 
3. For paragraph modules: use "text" instead of "content"
4. For button modules: use "text" instead of "content", "href" instead of "url"
5. Only include properties that are explicitly defined in the schema

// ... rest of correction prompt ...

// Call Anthropic API again with correction prompt
const correctionResponse = await fetch('/api/anthropic', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: correctionPrompt
  })
});

// Process the corrected response...
```

### 5. Beefree SDK Integration

#### Converting Simple to Full JSON
```javascript
// Convert simple JSON to full JSON using Beefree CSAPI
const beefreeResponse = await fetch('/api/beefree/simple-to-full', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    template: emailJson.template
  })
});

if (!beefreeResponse.ok) {
  const errorData = await beefreeResponse.text();
  throw new Error(`Failed to convert template: ${beefreeResponse.status} ${beefreeResponse.statusText}`);
}

const fullJson = await beefreeResponse.json();
console.log('Full JSON from Beefree:', fullJson);

// Store the full JSON locally
localStorage.setItem('fullEmailJson', JSON.stringify(fullJson));
```

#### Loading in Beefree SDK Builder
```javascript
// In builder.html
let selectedTemplate = null;
try {
  const emailData = localStorage.getItem('fullEmailJson');
  if (emailData) {
    selectedTemplate = JSON.parse(emailData);
    console.log('Loaded email data from storage:', selectedTemplate);
    
    // Clear the stored data after loading
    localStorage.removeItem('fullEmailJson');
  }
} catch (e) {
  console.error('Error parsing email data:', e);
}

// Beefree SDK configuration
const beeConfig = {
  container: 'bee-plugin-container',
  uid: 'demo-user-' + Date.now(),
  language: 'en-US',
  specialLinks: [
    {
      type: "unsubscribe",
      label: "Unsubscribe",
      link: "http://[unsubscribe]/",
    },
    {
      type: "subscribe",
      label: "Subscribe",
      link: "http://[subscribe]/",
    },
  ],
  mergeTags: [
    {
      name: "First Name",
      value: "[first_name]",
    },
    {
      name: "Last Name",
      value: "[last_name]",
    },
    {
      name: "Email",
      value: "[email]",
    },
  ],
  onSave: function (jsonFile, htmlFile) {
    console.log("Template saved:", jsonFile);
  },
  onAutoSave: function (jsonFile) {
    console.log("Auto-saving template...");
    localStorage.setItem("email.autosave", jsonFile);
  },
  onSend: function (htmlFile) {
    console.log("Email ready to send:", htmlFile);
  },
  onError: function (errorMessage) {
    console.error("Beefree SDK error:", errorMessage);
  }
};

// Initialize Beefree SDK
function initializeBeefree(authResponse) {
  BeePlugin.create(authResponse, beeConfig, function (beePluginInstance) {
    console.log('Beefree SDK initialized successfully');
    
    // Check if we have a template to load
    if (selectedTemplate) {
      try {
        beePluginInstance.start(selectedTemplate);
        console.log('Loaded template from localStorage');
      } catch (error) {
        console.error('Error loading template:', error);
        // Fallback to empty template
        beePluginInstance.start();
      }
    } else {
      // Start with empty template
      beePluginInstance.start();
      console.log('Started with empty template');
    }
  });
}
```

## Complete Implementation

### Proxy Server (proxy-server.js)
```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Load credentials
const credentials = require('./credentials.js');

// Proxy endpoint for Anthropic API
app.post('/api/anthropic', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': credentials.anthropic_api_key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `Anthropic API error: ${response.status} ${response.statusText}`,
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Proxy endpoint for Beefree CSAPI - Simple to Full JSON
app.post('/api/beefree/simple-to-full', async (req, res) => {
  try {
    const { template } = req.body;
    
    if (!template) {
      return res.status(400).json({ error: 'Template is required' });
    }

    const response = await fetch('https://api.getbee.io/v1/conversion/simple-to-full-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.beefree_api_key}`
      },
      body: JSON.stringify({ template })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `Beefree API error: ${response.status} ${response.statusText}`,
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
```

## Customization Tips

1. **Prompt Engineering**: Modify the prompt to generate different types of emails or include specific branding requirements
2. **Module Types**: Add custom module types or modify existing ones based on your needs
3. **Error Handling**: Implement more sophisticated error correction logic
4. **Template Validation**: Add additional validation before sending to Beefree API
5. **Caching**: Implement caching for frequently requested email types
6. **User Experience**: Add progress indicators and better error messages

## Troubleshooting

- **JSON Parsing Errors**: Check the raw response from Anthropic and adjust parsing logic
- **Beefree Validation Errors**: Review the error details and update the correction prompt
- **API Rate Limits**: Implement rate limiting and retry logic
- **Template Loading Issues**: Verify localStorage permissions and data format

This recipe provides a complete foundation for building AI-powered email creation systems with Beefree SDK and Anthropic's Claude API. 