---
description: >-
  Create AI-generated Email Sequences in Beefree SDK with Anthropic's Claude AI and
  Simple Schema
---

# Create AI-generated Email Sequences in Beefree SDK with Claude AI

## Overview

This recipe explains how to build an AI-powered email sequence creation system that generates three strategically designed emails using [Anthropic's Messages API](https://docs.anthropic.com/en/api/messages), along with the [Claude Sonnet 4 model](https://docs.anthropic.com/en/docs/about-claude/models/overview#model-names), and converts them to full Beefree SDK templates using both [Simple Schema](../../data-structures/simple-schema) and the [Content Services API](../../apis/content-services-api).

This recipe covers:

1. **Simple Schema**: Understanding the [template structure](../../data-structures/simple-schema/template-schema) and [unified schema](../../../data-structures/simple-schema#simple-unified-schema) for multiple emails.
2. **Anthropic API Integration**: [Structuring sequential API calls](https://docs.anthropic.com/en/api/messages) with different contexts for each email type.
3. **Frontend Integration**: Capturing end user email descriptions and managing progressive UI updates for multiple email generation.
4. **Response Parsing**: Extracting and validating JSON from multiple AI responses with error correction loops.
5. **Beefree SDK Integration**: Converting [multiple simple templates to full templates](../../../apis/content-services-api/convert#simple-to-full-json) and [managing navigation between emails](../../getting-started/readme/installation/methods-and-events).

Reference the complete code for this project in the [multiple-versions-concept](broken-reference) folder inside the [Simple Schema GitHub repository](https://github.com/BeefreeSDK/beefree-sdk-simple-schema/tree/main).

{% embed url="https://github.com/BeefreeSDK/beefree-sdk-simple-schema/tree/main/multiple-versions-concept" %}

## Prerequisites

* [Node.js](broken-reference)
* [Anthropic API key](https://docs.anthropic.com/en/api/overview)
* [Beefree SDK credentials](../../../getting-started/readme/create-an-application#obtain-your-client-id-and-client-secret)
* Understanding of Beefree SDK's [Simple Schema](../../data-structures/simple-schema)
* Knowledge of Beefree SDK's [Content Services API](../../apis/content-services-api) and [`/simple-to-full-json endpoint`](../../../apis/content-services-api/convert#simple-to-full-json)&#x20;

## Core Concepts and Steps

This section details all of the core concepts required to integrate AI-generated email sequences within Beefree SDK. It includes descriptions of each concept, sample code, and the complete implementation at the end, along with customization tips.

As a reminder, the complete code for this recipe is available for reference in [GitHub](broken-reference).

The following video shows the final result, and how the code for this recipe looks when you run it locally on your machine. &#x20;

{% embed url="https://screen.studio/share/G7GQSZet" %}

&#x20;The following diagram shows how these core concepts relate to one another to create the experience shown in the video above.

<figure><img src="https://806400411-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F8c7XIQHfAtM23Dp3ozIC%2Fuploads%2FUM25XtPneeIwKIlBMeol%2Fimage.png?alt=media&#x26;token=ba9b41e4-be22-4c18-b79c-7d98cf232ce4" alt=""><figcaption></figcaption></figure>

## 1. Simple Schema Structure for Sequences

[Simple Schema](../../data-structures/simple-schema) is a simplified JSON format that makes it easy to generate email templates programmatically. It uses a hierarchical structure with templates, rows, columns, and modules. Understanding and using Simple Schema is critical for building AI-powered workflows, because it's simpler JSON makes it much easier for AI to read, understand, and build. Beefree SDK's full JSON is complex and feature-rich, making it difficult to train AI on.&#x20;

For email sequences, the Simple Schema remains the same for each email, but we generate three different emails with specific purposes and contexts.

#### **Email Types and Contexts**

The following code snippet shows how to define different email types with specific contexts for sequence generation.

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

#### **Template Structure (Same for all emails)**

The following code snippet shows the template structure for simple JSON that applies to all emails in the sequence.

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

#### **Supported Module Types**

Simple Schema supports the following module types:

* `title` - Email titles and headings
* `paragraph` - Text content
* `button` - Call-to-action buttons
* `image` - Images and graphics
* `divider` - Visual separators
* `html` - Custom HTML content
* `list` - Bulleted or numbered lists
* `menu` - Menus
* `icons` - Social media and other icons

### 2. Sequential Anthropic API Integration

This section discusses how to structure and make sequential API calls to Anthropic for generating multiple emails with different contexts.

#### **Sequential Email Creation Function**

The following code snippet shows how to create emails sequentially with different contexts for each email type.

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

#### **API Call Structure**

The following code snippet shows an example API call to Anthropic for sequential email generation.

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

### 3. Frontend Integration for Sequences

This section discusses the Frontend integration and how to capture an end user's email description prompt, manage progressive UI updates, and handle navigation between multiple emails.

#### **Sequence Initialization**

The following code snippet shows how to initialize the email sequence creation process.

```javascript
async function processEmailSequence(userDescription) {
  isProcessing = true;
  sendButton.disabled = true;
  currentEmailIndex = 0;
  
  addMessage('assistant', 'I\'ll create a complete email sequence for you! Let me start with the welcome email...');
  
  await createEmail(0, userDescription);
}
```

#### **Capturing User Input**

```javascript
function sendMessage() {
  if (isProcessing) return;
  
  const message = userInput.value.trim();
  if (!message) return;

  addMessage('user', message);
  userInput.value = '';
  userInput.style.height = 'auto';
  
  processEmailSequence(message);
}
```

#### **Progressive UI Updates**

The following code snippet shows how to update the UI progressively as each email is created.

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

This section includes two important topics. The first is how to parse the response from Anthropic to only get the simple JSON and pass it to the `/simple-to-full-json` endpoint. The second is how to configure a second API call in the event the first one fails. Beefree SDK provides comprehensive feedback in the error message for a failed `/simple-to-full-json` API call. By applying this comprehensive feedback in a second API, the AI model being used can typically return a valid simple JSON ready for conversion to full JSON.

#### **Sequential Parsing Logic**

The following code snippet shows how to parse responses for multiple emails in sequence.

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

#### **Error Correction for Sequences**

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

This section discusses the Beefree SDK integration for managing multiple emails. Beefree SDK provides the editing environment to load the full JSON into once it is created. Once it is loaded within the editor, the end user can begin customizing their AI-generated email design and navigate between different emails in the sequence.

#### **Multiple Template Storage**

The following code snippet shows how to store multiple emails with specific keys for navigation.

```javascript
// Store each email with a specific key
localStorage.setItem('welcomeEmailJson', JSON.stringify(welcomeFullJson));
localStorage.setItem('onboardingEmailJson', JSON.stringify(onboardingFullJson));
localStorage.setItem('upgradeEmailJson', JSON.stringify(upgradeFullJson));
```

#### **Opening Specific Emails in Builder**

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

#### **Converting Simple to Full JSON**

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

// Store the full JSON locally with specific key
localStorage.setItem(emailType.key, JSON.stringify(fullJson));
```

#### **Persistent Email Navigation**

The following code snippet shows how to manage navigation between emails and persist state.

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

#### **Enhanced Builder with Navigation**

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

// Initialize Beefree SDK (do not use .create or BeePlugin)
async function initializeBeefree() {
  try {
    const json = await getTemplate(); // your function to get the template
    const token = await getToken(); // your function to get the token from BE
    const BeefreeSDKInstance = new BeefreeSDK(token);
    BeefreeSDKInstance
      .start(beeConfig, json, "", { shared: false })
      .then((instance) => {
        // Do things here after the editor is initialized
      });
  } catch (error) {
    console.error("error during initialization --> ", error);
  }
}
```

## Complete Implementation

This section includes the code for both APIs together (Anthropic API call and `/simple-to-full-json` API call), and the dependencies they require.&#x20;

#### Proxy Server (proxy-server.js)

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

This section list a few customization tips you can apply to the code in your own environment.&#x20;

* **Email Types**: Modify the `emailTypes` array to create different sequences (e.g., product launch, seasonal campaigns)
* **Context Customization**: Adjust the context prompts for each email type based on your specific needs
* **Sequential Logic**: Add delays between email generation or implement parallel processing
* **Progress Tracking**: Add more detailed progress indicators for each email
* **Template Validation**: Implement sequence-specific validation rules
* **User Experience**: Add preview functionality for the entire sequence

## Troubleshooting

If you encounter any errors, try troubleshooting the following:

* **Sequential Errors**: Handle failures in individual email generation without stopping the entire sequence
* **Storage Management**: Implement cleanup for old sequences and manage localStorage limits
* **Navigation Issues**: Ensure proper state management when switching between emails
* **Performance**: Optimize for multiple API calls and large template storage

This recipe provides a complete foundation for building AI-powered email sequence creation systems with Beefree SDK and Anthropic's Messages API and Claude Sonnet 4 model. 