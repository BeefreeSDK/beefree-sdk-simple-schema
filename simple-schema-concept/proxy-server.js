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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Proxy endpoint for Anthropic API
app.post('/api/anthropic', async (req, res) => {
  console.log('Received Anthropic API request:', req.body);
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      console.log('No prompt provided');
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
      console.error('Anthropic API error:', errorData);
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

// Proxy endpoint for Beefree API - Authentication (V2)
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
      console.error('Beefree auth error:', errorData);
      return res.status(response.status).json({ 
        error: `Beefree auth error: ${response.status} ${response.statusText}`,
        details: errorData
      });
    }

    const data = await response.json();
    console.log('Beefree auth response:', data);
    res.json(data);
    
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Proxy endpoint for Beefree API - Simple to Full JSON
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
      console.error('Beefree API error (simple-to-full):', errorData);
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

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  POST /api/anthropic');
  console.log('  POST /api/beefree/auth');
  console.log('  POST /api/beefree/simple-to-full');
});
