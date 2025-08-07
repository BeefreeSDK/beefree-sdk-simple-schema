---
description: >-
  Create AI-powered Partial Design Edits in Beefree SDK with Anthropic's Claude AI and
  Simple Schema
---

# Create AI-powered Partial Design Edits in Beefree SDK with Claude AI

## Overview

This recipe explains how to build an AI-powered partial design editing system that makes targeted modifications to existing email templates using [Anthropic's Messages API](https://docs.anthropic.com/en/api/messages), along with the [Claude Sonnet 4 model](https://docs.anthropic.com/en/docs/about-claude/models/overview#model-names), and integrates with Beefree SDK using both [Simple Schema](../../data-structures/simple-schema) and the [Content Services API](../../apis/content-services-api).

This recipe covers:

1. **Simple Schema**: Understanding the [template structure](../../data-structures/simple-schema/template-schema) and [unified schema](../../../data-structures/simple-schema#simple-unified-schema) for partial edits.
2. **Anthropic API Integration**: [Structuring API calls](https://docs.anthropic.com/en/api/messages) for targeted template modifications.
3. **Frontend Integration**: Capturing end user edit requests and managing template state.
4. **Response Parsing**: Extracting and validating partial JSON edits from AI responses.
5. **Beefree SDK Integration**: Applying [partial edits to existing templates](../../../apis/content-services-api/convert#simple-to-full-json) and [updating the builder](../../getting-started/readme/installation/methods-and-events).

Reference the complete code for this project in the [partial-design-edits-concept](broken-reference) folder inside the [Simple Schema GitHub repository](https://github.com/BeefreeSDK/beefree-sdk-simple-schema/tree/main).

{% embed url="https://github.com/BeefreeSDK/beefree-sdk-simple-schema/tree/main/partial-design-edits-concept" %}

## Prerequisites

* [Node.js](broken-reference)
* [Anthropic API key](https://docs.anthropic.com/en/api/overview)
* [Beefree SDK credentials](../../../getting-started/readme/create-an-application#obtain-your-client-id-and-client-secret)
* Understanding of Beefree SDK's [Simple Schema](../../data-structures/simple-schema)
* Knowledge of Beefree SDK's [Content Services API](../../apis/content-services-api) and [`/simple-to-full-json endpoint`](../../../apis/content-services-api/convert#simple-to-full-json)&#x20;

## Core Concepts and Steps

This section details all of the core concepts required to integrate AI-powered partial design editing within Beefree SDK. It includes descriptions of each concept, sample code, and the complete implementation at the end, along with customization tips.

As a reminder, the complete code for this recipe is available for reference in [GitHub](broken-reference).

The following video shows the final result, and how the code for this recipe looks when you run it locally on your machine. &#x20;

{% embed url="https://screen.studio/share/G7GQSZet" %}

&#x20;The following diagram shows how these core concepts relate to one another to create the experience shown in the video above.

<figure><img src="https://806400411-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F8c7XIQHfAtM23Dp3ozIC%2Fuploads%2FUM25XtPneeIwKIlBMeol%2Fimage.png?alt=media&#x26;token=ba9b41e4-be22-4c18-b79c-7d98cf232ce4" alt=""><figcaption></figcaption></figure>

## 1. Simple Schema Structure for Partial Edits

[Simple Schema](../../data-structures/simple-schema) is a simplified JSON format that makes it easy to generate email templates programmatically. It uses a hierarchical structure with templates, rows, columns, and modules. Understanding and using Simple Schema is critical for building AI-powered workflows, because it's simpler JSON makes it much easier for AI to read, understand, and build. Beefree SDK's full JSON is complex and feature-rich, making it difficult to train AI on.&#x20;

For partial design edits, we work with existing templates and make targeted modifications to specific sections while preserving the overall structure.

#### **Template Structure for Edits**

The following code snippet shows the template structure for simple JSON that supports partial edits.

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

#### **Supported Module Types for Edits**

Simple Schema supports the following module types for partial edits:

* `title` - Email titles and headings
* `paragraph` - Text content
* `button` - Call-to-action buttons
* `image` - Images and graphics
* `divider` - Visual separators
* `html` - Custom HTML content
* `list` - Bulleted or numbered lists
* `menu` - Menus
* `icons` - Social media and other icons

#### **Edit Types and Contexts**

The following code snippet shows how to define different types of edits with specific contexts.

```javascript
const editTypes = [
  { 
    name: 'Content Update', 
    key: 'contentEdit', 
    context: 'update the content while maintaining the existing design and structure' 
  },
  { 
    name: 'Style Modification', 
    key: 'styleEdit', 
    context: 'modify colors, fonts, and styling while keeping the content intact' 
  },
  { 
    name: 'Layout Adjustment', 
    key: 'layoutEdit', 
    context: 'adjust the layout and spacing while preserving the content and overall design' 
  },
  { 
    name: 'Module Addition', 
    key: 'moduleEdit', 
    context: 'add new modules or sections while maintaining the existing design consistency' 
  }
];
```

### 2. Anthropic API Integration for Partial Edits

This section discusses how to structure and make API calls to Anthropic for generating targeted template modifications.

#### **API Call Structure**

The following code snippet shows an example API call to Anthropic for partial design edits.

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

#### **Partial Edit Request**

The following code snippet shows an example prompt for partial design edits.

```javascript
const prompt = `I have an existing email template that I want to modify. Here is the current template structure: ${JSON.stringify(currentTemplate, null, 2)}. 

The user wants to make the following changes: "${userEditRequest}". 

Please provide ONLY the modified sections of the template that need to be changed. Return the changes in this format:

{
  "edits": [
    {
      "type": "update",
      "path": "template.rows[0].columns[0].modules[0]",
      "content": {
        "type": "title",
        "text": "Updated title text"
      }
    },
    {
      "type": "add",
      "path": "template.rows[1]",
      "content": {
        "name": "New Row",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "paragraph",
                "text": "New content here"
              }
            ]
          }
        ]
      }
    }
  ]
}

Available edit types:
- "update": Modify existing content
- "add": Add new sections or modules
- "remove": Remove existing sections or modules
- "replace": Replace entire sections

Available module types: title, paragraph, button, image, divider, html, list, menu, icons

Make sure the edits maintain the overall design consistency and follow email marketing best practices.`;
```

#### **Sample Response**

The following code snippet shows an example response from Anthropic for partial edits.

```json
{
  "id": "msg_01MVjrNK8LRDxEEFdWuHRdED",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-20250514",
  "content": [
    {
      "type": "text",
      "text": "```json\n{\n  \"edits\": [\n    {\n      \"type\": \"update\",\n      \"path\": \"template.rows[0].columns[0].modules[0]\",\n      \"content\": {\n        \"type\": \"title\",\n        \"text\": \"Updated Welcome Message!\"\n      }\n    },\n    {\n      \"type\": \"add\",\n      \"path\": \"template.rows[1]\",\n      \"content\": {\n        \"name\": \"New Section\",\n        \"columns\": [\n          {\n            \"weight\": 12,\n            \"modules\": [\n              {\n                \"type\": \"paragraph\",\n                \"text\": \"This is new content added to your email.\"\n              }\n            ]\n          }\n        ]\n      }\n    }\n  ]\n}\n```"
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 727,
    "output_tokens": 1809
  }
}
```

### 3. Frontend Integration for Partial Edits

This section discusses the Frontend integration and how to capture an end user's edit requests, manage template state, and provide real-time preview of changes.

#### **Capturing Edit Requests**

The following code snippet shows how to capture user edit requests.

```javascript
function sendEditRequest() {
  if (isProcessing) return;
  
  const editRequest = userInput.value.trim();
  if (!editRequest) return;

  addMessage('user', editRequest);
  userInput.value = '';
  userInput.style.height = 'auto';
  
  processEditRequest(editRequest);
}
```

#### **Processing Edit Requests**

```javascript
async function processEditRequest(userEditRequest) {
  isProcessing = true;
  sendButton.disabled = true;
  showTypingIndicator();

  try {
    // Get the current template from localStorage or state
    const currentTemplate = getCurrentTemplate();
    
    if (!currentTemplate) {
      throw new Error('No template found. Please load a template first.');
    }

    // Create the prompt for Anthropic
    const prompt = `I have an existing email template that I want to modify. Here is the current template structure: ${JSON.stringify(currentTemplate, null, 2)}. 

    The user wants to make the following changes: "${userEditRequest}". 

    Please provide ONLY the modified sections of the template that need to be changed. Return the changes in this format:

    {
      "edits": [
        {
          "type": "update",
          "path": "template.rows[0].columns[0].modules[0]",
          "content": {
            "type": "title",
            "text": "Updated title text"
          }
        }
      ]
    }

    Available edit types:
    - "update": Modify existing content
    - "add": Add new sections or modules
    - "remove": Remove existing sections or modules
    - "replace": Replace entire sections

    Available module types: title, paragraph, button, image, divider, html, list, menu, icons

    Make sure the edits maintain the overall design consistency and follow email marketing best practices.`;

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
      throw new Error(`Failed to process edit: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Anthropic API response:', data);
    
    // Continue with parsing and applying edits...
  } catch (error) {
    console.error('Error processing edit:', error);
    addMessage('assistant', `Sorry, there was an error processing your edit: ${error.message}`);
  } finally {
    isProcessing = false;
    sendButton.disabled = false;
  }
}
```

#### **Template State Management**

```javascript
function getCurrentTemplate() {
  const templateData = localStorage.getItem('currentTemplate');
  if (templateData) {
    return JSON.parse(templateData);
  }
  return null;
}

function updateCurrentTemplate(template) {
  localStorage.setItem('currentTemplate', JSON.stringify(template));
  updatePreview(template);
}

function updatePreview(template) {
  // Update the preview area with the modified template
  const previewContainer = document.getElementById('template-preview');
  if (previewContainer) {
    // Generate HTML preview or show template structure
    previewContainer.innerHTML = `<pre>${JSON.stringify(template, null, 2)}</pre>`;
  }
}
```

### 4. Response Parsing for Partial Edits

This section includes two important topics. The first is how to parse the response from Anthropic to extract the edit instructions. The second is how to apply these edits to the existing template structure.

#### **Extracting Edit Instructions**

The following code snippet shows how to parse edit instructions from Anthropic's response.

```javascript
// Extract the text content from the response
let editJsonText = '';
if (data.content && data.content.length > 0) {
  const textBlock = data.content.find(block => block.type === 'text');
  if (textBlock) {
    editJsonText = textBlock.text;
  } else {
    throw new Error('No text content found in API response');
  }
} else {
  throw new Error('Invalid response structure from Anthropic API');
}

// Parse the JSON from the response
let editInstructions;
try {
  // First try to find JSON in code blocks
  const jsonMatch = editJsonText.match(/```json\s*([\s\S]*?)\s*```/) || 
                   editJsonText.match(/```\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch) {
    editInstructions = JSON.parse(jsonMatch[1]);
  } else {
    // If no code blocks, try to find JSON object in the text
    const jsonObjectMatch = editJsonText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (jsonObjectMatch) {
      editInstructions = JSON.parse(jsonObjectMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  }
  
  // Validate that we have the required edit structure
  if (!editInstructions.edits || !Array.isArray(editInstructions.edits)) {
    throw new Error('Invalid edit structure - missing edits array');
  }
  
  console.log('Parsed edit instructions:', editInstructions);
} catch (parseError) {
  console.error('JSON parsing error:', parseError);
  console.error('Raw response text:', editJsonText);
  throw new Error(`Invalid JSON format in response: ${parseError.message}`);
}
```

#### **Applying Edits to Template**

```javascript
function applyEditsToTemplate(template, edits) {
  const updatedTemplate = JSON.parse(JSON.stringify(template)); // Deep clone
  
  edits.forEach(edit => {
    try {
      switch (edit.type) {
        case 'update':
          updateTemplatePath(updatedTemplate, edit.path, edit.content);
          break;
        case 'add':
          addToTemplatePath(updatedTemplate, edit.path, edit.content);
          break;
        case 'remove':
          removeFromTemplatePath(updatedTemplate, edit.path);
          break;
        case 'replace':
          replaceTemplatePath(updatedTemplate, edit.path, edit.content);
          break;
        default:
          console.warn(`Unknown edit type: ${edit.type}`);
      }
    } catch (error) {
      console.error(`Error applying edit: ${error.message}`, edit);
    }
  });
  
  return updatedTemplate;
}

function updateTemplatePath(template, path, content) {
  const pathParts = path.split('.');
  let current = template;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (part.includes('[')) {
      // Handle array access
      const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        current = current[arrayName][parseInt(index)];
      }
    } else {
      current = current[part];
    }
  }
  
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart.includes('[')) {
    const arrayMatch = lastPart.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      current[arrayName][parseInt(index)] = content;
    }
  } else {
    current[lastPart] = content;
  }
}

function addToTemplatePath(template, path, content) {
  const pathParts = path.split('.');
  let current = template;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (part.includes('[')) {
      const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        current = current[arrayName][parseInt(index)];
      }
    } else {
      current = current[part];
    }
  }
  
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart.includes('[')) {
    const arrayMatch = lastPart.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      current[arrayName].splice(parseInt(index), 0, content);
    }
  } else {
    if (Array.isArray(current[lastPart])) {
      current[lastPart].push(content);
    } else {
      current[lastPart] = content;
    }
  }
}
```

### 5. Beefree SDK Integration for Partial Edits

This section discusses the Beefree SDK integration for applying partial edits. Beefree SDK provides the editing environment to load the modified JSON into once the edits are applied. Once it is loaded within the editor, the end user can see the changes and continue customizing their email design.

#### **Converting Modified Template to Full JSON**

```javascript
// Convert modified simple JSON to full JSON using Beefree CSAPI
const beefreeResponse = await fetch('/api/beefree/simple-to-full', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    template: modifiedTemplate.template
  })
});

if (!beefreeResponse.ok) {
  const errorData = await beefreeResponse.text();
  throw new Error(`Failed to convert modified template: ${beefreeResponse.status} ${beefreeResponse.statusText}`);
}

const fullJson = await beefreeResponse.json();
console.log('Full JSON from Beefree:', fullJson);

// Store the modified full JSON locally
localStorage.setItem('modifiedEmailJson', JSON.stringify(fullJson));
```

#### **Loading Modified Template in Builder**

```javascript
// In builder.html
let selectedTemplate = null;
try {
  const emailData = localStorage.getItem('modifiedEmailJson');
  if (emailData) {
    selectedTemplate = JSON.parse(emailData);
    console.log('Loaded modified email data from storage:', selectedTemplate);
    
    // Clear the stored data after loading
    localStorage.removeItem('modifiedEmailJson');
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
    
    // Check if we have a modified template to load
    if (selectedTemplate) {
      try {
        beePluginInstance.start(selectedTemplate);
        console.log('Loaded modified template from localStorage');
      } catch (error) {
        console.error('Error loading modified template:', error);
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

#### **Edit History and Undo Functionality**

```javascript
// Track edit history for undo functionality
let editHistory = [];
let currentHistoryIndex = -1;

function saveEditState(template) {
  // Remove any future history if we're not at the end
  editHistory = editHistory.slice(0, currentHistoryIndex + 1);
  
  // Add new state
  editHistory.push(JSON.parse(JSON.stringify(template)));
  currentHistoryIndex++;
  
  // Limit history size
  if (editHistory.length > 10) {
    editHistory.shift();
    currentHistoryIndex--;
  }
  
  updateUndoButtons();
}

function undoEdit() {
  if (currentHistoryIndex > 0) {
    currentHistoryIndex--;
    const previousTemplate = editHistory[currentHistoryIndex];
    updateCurrentTemplate(previousTemplate);
    updateUndoButtons();
  }
}

function redoEdit() {
  if (currentHistoryIndex < editHistory.length - 1) {
    currentHistoryIndex++;
    const nextTemplate = editHistory[currentHistoryIndex];
    updateCurrentTemplate(nextTemplate);
    updateUndoButtons();
  }
}

function updateUndoButtons() {
  const undoButton = document.getElementById('undo-button');
  const redoButton = document.getElementById('redo-button');
  
  if (undoButton) {
    undoButton.disabled = currentHistoryIndex <= 0;
  }
  
  if (redoButton) {
    redoButton.disabled = currentHistoryIndex >= editHistory.length - 1;
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

## Partial Edit Strategies

### Content Updates
- **Purpose**: Modify text content while preserving design
- **Context**: Update the content while maintaining the existing design and structure
- **Key Elements**: 
  - Text modifications
  - Content replacement
  - Message updates
  - Call-to-action changes

### Style Modifications
- **Purpose**: Change colors, fonts, and styling
- **Context**: Modify colors, fonts, and styling while keeping the content intact
- **Key Elements**:
  - Color scheme updates
  - Font changes
  - Spacing adjustments
  - Visual enhancements

### Layout Adjustments
- **Purpose**: Modify structure and arrangement
- **Context**: Adjust the layout and spacing while preserving the content and overall design
- **Key Elements**:
  - Column adjustments
  - Row modifications
  - Spacing changes
  - Structure updates

### Module Additions
- **Purpose**: Add new content sections
- **Context**: Add new modules or sections while maintaining the existing design consistency
- **Key Elements**:
  - New sections
  - Additional modules
  - Content blocks
  - Interactive elements

## Customization Tips

This section list a few customization tips you can apply to the code in your own environment.&#x20;

* **Edit Types**: Modify the `editTypes` array to support different types of modifications
* **Validation Rules**: Add custom validation for specific edit types
* **Preview Functionality**: Implement real-time preview of changes before applying
* **Batch Edits**: Support multiple edits in a single request
* **Template Versioning**: Implement version control for template modifications
* **User Experience**: Add confirmation dialogs and progress indicators

## Troubleshooting

If you encounter any errors, try troubleshooting the following:

* **Path Resolution**: Ensure edit paths correctly reference template structure
* **Validation Errors**: Check that modifications maintain schema compliance
* **State Management**: Verify template state is properly maintained across edits
* **Performance**: Optimize for large templates and complex modifications

This recipe provides a complete foundation for building AI-powered partial design editing systems with Beefree SDK and Anthropic's Messages API and Claude Sonnet 4 model.
