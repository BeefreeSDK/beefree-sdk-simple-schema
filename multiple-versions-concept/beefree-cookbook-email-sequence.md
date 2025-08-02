# Create AI-generated Email Sequences in Beefree SDK with Anthropic's Claude AI and Simple Schema

This recipe demonstrates how to build an AI-powered email sequence creation system that generates three strategically designed emails using Anthropic's Claude API and converts them to full Beefree SDK templates using the Simple Schema format.

## Overview

This recipe covers:
1. **Simple Schema**: Understanding the template structure and unified schema for multiple emails
2. **Anthropic API Integration**: Structuring sequential API calls with different contexts
3. **Frontend Integration**: Capturing user input and managing multiple email generation
4. **Response Parsing**: Extracting and validating JSON from multiple AI responses
5. **Beefree SDK Integration**: Converting multiple simple templates to full templates and managing navigation

## Prerequisites

- Node.js (v14 or higher)
- Anthropic API key
- Beefree SDK credentials
- Basic knowledge of JavaScript and Express.js

## Core Concepts

### 1. Simple Schema Structure for Sequences

The Simple Schema remains the same for each email, but we generate three different emails with specific purposes:

#### Email Types and Contexts
```javascript
const emailTypes = [
  { 
    name: 'Welcome', 
    key: 'welcomeEmailJson', 
    context: 'create an outstanding welcome email following email marketing best practices' 
  },
  { 
    name: 'Onboarding', 
    key: 'onboardingEmailJson', 
    context: 'Create an amazing onboarding email following email marketing and instructional best practices' 
  },
  { 
    name: 'Upgrade', 
    key: 'upgradeEmailJson', 
    context: 'Create an upgrade your subscription for more perks email following email marketing best practices and outlining the top three perks for upgrading. Include a CTA to example.com' 
  }
];
```

#### Template Structure (Same for all emails)
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

### 2. Sequential Anthropic API Integration

#### Sequential Email Creation Function
```javascript
async function createEmail(index, description) {
  if (index >= emailTypes.length) {
    // All emails are done
    hideTypingIndicator();
    addMessage('assistant', '🎉 Your complete email sequence has been created!');
    displayAllEmailButtons();
    isProcessing = false;
    sendButton.disabled = false;
    return;
  }

  const emailType = emailTypes[index];
  showTypingIndicator();
  
  if (index > 0) {
    addMessage('assistant', `${emailType.name} email being created...`);
  }

  try {
    // Create the prompt for Anthropic with specific context
    const prompt = `Use this email marketer's description of their dream email to design a stunning email that meets all of the requirements they outlined in their description. Here is the description: "${description}". ${emailType.context}. The email you deliver should meet industry best practices in email marketing and adhere to trending design tips from the best email designers in the industry. The final output should be in Beefree SDK's simple template schema format. 

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
      throw new Error(`Failed to generate ${emailType.name} email: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Anthropic API response for ${emailType.name}:`, data);
    
    // Process the response and convert to full JSON
    // ... (same parsing logic as single email)
    
    // Store the full JSON locally with specific key
    localStorage.setItem(emailType.key, JSON.stringify(fullJson));
    
    // Show button for this email if it's the first one
    if (index === 0) {
      hideTypingIndicator();
      addMessage('assistant', `✅ ${emailType.name} email created successfully!`);
      displayEmailButton(emailType.name, emailType.key);
    }

    // Move to next email
    currentEmailIndex = index + 1;
    await createEmail(currentEmailIndex, description);
    
  } catch (error) {
    console.error(`Error processing ${emailType.name} email:`, error);
    hideTypingIndicator();
    addMessage('assistant', `Sorry, there was an error creating the ${emailType.name} email: ${error.message}`);
    isProcessing = false;
    sendButton.disabled = false;
  }
}
```

### 3. Frontend Integration for Sequences

#### Sequence Initialization
```javascript
async function processEmailSequence(userDescription) {
  isProcessing = true;
  sendButton.disabled = true;
  currentEmailIndex = 0;
  
  addMessage('assistant', 'I\'ll create a complete email sequence for you! Let me start with the welcome email...');
  
  await createEmail(0, userDescription);
}
```

#### Progressive UI Updates
```javascript
function displayEmailButton(emailName, storageKey) {
  welcomeState.classList.add('hidden');
  emailResult.classList.remove('hidden');
  
  emailResult.innerHTML = `
    <div class="email-preview">
      <h4>${emailName} Email Ready!</h4>
      <div class="email-preview-content">
        <p>Your ${emailName.toLowerCase()} email has been generated and is ready for customization.</p>
      </div>
    </div>
    <div class="action-buttons">
      <button class="btn btn-primary" onclick="openInBuilder('${storageKey}', '${emailName}')">
        🎨 Edit ${emailName} Email
      </button>
    </div>
  `;
}

function displayAllEmailButtons() {
  welcomeState.classList.add('hidden');
  emailResult.classList.remove('hidden');
  
  emailResult.innerHTML = `
    <div class="email-preview">
      <h4>Your Complete Email Sequence is Ready!</h4>
      <div class="email-preview-content">
        <p>All three emails have been generated and are ready for customization.</p>
      </div>
    </div>
    <div class="email-buttons">
      <button class="email-button" onclick="openInBuilder('welcomeEmailJson', 'Welcome')">
        🎨 Edit Welcome Email
      </button>
      <button class="email-button" onclick="openInBuilder('onboardingEmailJson', 'Onboarding')">
        🎨 Edit Onboarding Email
      </button>
      <button class="email-button" onclick="openInBuilder('upgradeEmailJson', 'Upgrade')">
        🎨 Edit Upgrade Email
      </button>
    </div>
    <div class="action-buttons" style="margin-top: 20px;">
      <button class="btn btn-secondary" onclick="startNewEmail()">
        ➕ Create Another Sequence
      </button>
    </div>
  `;
}
```

### 4. Response Parsing for Multiple Emails

#### Sequential Parsing Logic
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
  
  console.log(`Parsed ${emailType.name} email JSON:`, emailJson);
} catch (parseError) {
  console.error('JSON parsing error:', parseError);
  console.error('Raw response text:', emailJsonText);
  throw new Error(`Invalid JSON format in response: ${parseError.message}`);
}
```

#### Error Correction for Sequences
```javascript
// If Beefree API returns validation errors, send back to Anthropic for correction
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
  addMessage('assistant', `I need to fix some formatting issues for the ${emailType.name} email. Let me correct the template...`);
  
  const correctionPrompt = `The previous template I generated had validation errors from the Beefree API. Here are the specific errors that need to be fixed:

${errorDetails}

The original user request was: "${description}"

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

### 5. Beefree SDK Integration for Sequences

#### Multiple Template Storage
```javascript
// Store each email with a specific key
localStorage.setItem('welcomeEmailJson', JSON.stringify(welcomeFullJson));
localStorage.setItem('onboardingEmailJson', JSON.stringify(onboardingFullJson));
localStorage.setItem('upgradeEmailJson', JSON.stringify(upgradeFullJson));
```

#### Opening Specific Emails in Builder
```javascript
function openInBuilder(storageKey, emailName) {
  const emailJson = localStorage.getItem(storageKey);
  if (emailJson) {
    // Store the email data in localStorage for the builder
    localStorage.setItem('currentEmailData', emailJson);
    localStorage.setItem('currentEmailName', emailName);
    window.location.href = 'builder.html';
  } else {
    alert(`No ${emailName} email data found. Please create an email sequence first.`);
  }
}
```

#### Persistent Email Navigation
```javascript
// Check if we have existing emails when page loads
function checkExistingEmails() {
  const welcomeEmail = localStorage.getItem('welcomeEmailJson');
  const onboardingEmail = localStorage.getItem('onboardingEmailJson');
  const upgradeEmail = localStorage.getItem('upgradeEmailJson');
  
  if (welcomeEmail || onboardingEmail || upgradeEmail) {
    // We have existing emails, show them
    displayExistingEmails();
    
    // Add a welcome back message
    setTimeout(() => {
      addMessage('assistant', 'Welcome back! Your email sequence is ready for editing. Click any button to open that email in the builder.');
    }, 500);
  }
}

function displayExistingEmails() {
  welcomeState.classList.add('hidden');
  emailResult.classList.remove('hidden');
  
  const welcomeEmail = localStorage.getItem('welcomeEmailJson');
  const onboardingEmail = localStorage.getItem('onboardingEmailJson');
  const upgradeEmail = localStorage.getItem('upgradeEmailJson');
  
  let emailButtons = '';
  
  if (welcomeEmail) {
    emailButtons += `<button class="email-button" onclick="openInBuilder('welcomeEmailJson', 'Welcome')">🎨 Edit Welcome Email</button>`;
  }
  if (onboardingEmail) {
    emailButtons += `<button class="email-button" onclick="openInBuilder('onboardingEmailJson', 'Onboarding')">🎨 Edit Onboarding Email</button>`;
  }
  if (upgradeEmail) {
    emailButtons += `<button class="email-button" onclick="openInBuilder('upgradeEmailJson', 'Upgrade')">🎨 Edit Upgrade Email</button>`;
  }
  
  emailResult.innerHTML = `
    <div class="email-preview">
      <h4>Your Email Sequence</h4>
      <div class="email-preview-content">
        <p>You have existing emails ready for editing. Click any button below to open that email in the builder.</p>
      </div>
    </div>
    <div class="email-buttons">
      ${emailButtons}
    </div>
    <div class="action-buttons" style="margin-top: 20px;">
      <button class="btn btn-secondary" onclick="startNewEmail()">
        ➕ Create New Sequence
      </button>
    </div>
  `;
}
```

#### Enhanced Builder with Navigation
```javascript
// In builder.html
let selectedTemplate = null;
let currentEmailName = 'Email';

try {
  const emailData = localStorage.getItem('currentEmailData');
  const emailName = localStorage.getItem('currentEmailName');
  
  if (emailData) {
    selectedTemplate = JSON.parse(emailData);
    currentEmailName = emailName || 'Email';
    console.log('Loaded email data from storage:', selectedTemplate);
    console.log('Email name:', currentEmailName);
    
    // Update the title
    document.getElementById('emailTitle').textContent = `${currentEmailName} Email Builder`;
    
    // Don't clear the stored data - keep it for navigation between emails
    // localStorage.removeItem('currentEmailData');
    // localStorage.removeItem('currentEmailName');
  }
} catch (e) {
  console.error('Error parsing email data:', e);
}

// Function to return to chat
function returnToChat() {
  window.location.href = 'index.html';
}

// Add back button to HTML
// <button class="back-button" onclick="returnToChat()">
//   ← Return to Chat
// </button>
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

// Proxy endpoint for Beefree Login API - Authentication (V2)
app.post('/api/beefree/auth', async (req, res) => {
  try {
    const { client_id, client_secret, uid } = req.body;
    
    if (!client_id || !client_secret || !uid) {
      return res.status(400).json({ error: 'client_id, client_secret, and uid are required' });
    }

    const response = await fetch('https://auth.getbee.io/loginV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        uid: uid
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `Beefree auth error: ${response.status} ${response.statusText}`,
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

## Email Sequence Strategy

### Welcome Email
- **Purpose**: First touchpoint with new subscribers
- **Context**: Outstanding welcome email following email marketing best practices
- **Key Elements**: 
  - Warm welcome message
  - Set expectations
  - Build excitement
  - Clear next steps

### Onboarding Email
- **Purpose**: Guide users through getting started
- **Context**: Amazing onboarding email following email marketing and instructional best practices
- **Key Elements**:
  - Step-by-step instructions
  - Helpful resources
  - User activation tips
  - Support information

### Upgrade Email
- **Purpose**: Encourage subscription upgrades
- **Context**: Upgrade your subscription for more perks email following email marketing best practices and outlining the top three perks for upgrading
- **Key Elements**:
  - Top three benefits
  - Clear value proposition
  - Strong call-to-action
  - Social proof

## Customization Tips

1. **Email Types**: Modify the `emailTypes` array to create different sequences (e.g., product launch, seasonal campaigns)
2. **Context Customization**: Adjust the context prompts for each email type based on your specific needs
3. **Sequential Logic**: Add delays between email generation or implement parallel processing
4. **Progress Tracking**: Add more detailed progress indicators for each email
5. **Template Validation**: Implement sequence-specific validation rules
6. **User Experience**: Add preview functionality for the entire sequence

## Troubleshooting

- **Sequential Errors**: Handle failures in individual email generation without stopping the entire sequence
- **Storage Management**: Implement cleanup for old sequences and manage localStorage limits
- **Navigation Issues**: Ensure proper state management when switching between emails
- **Performance**: Optimize for multiple API calls and large template storage

This recipe provides a complete foundation for building AI-powered email sequence creation systems with Beefree SDK and Anthropic's Claude API. 