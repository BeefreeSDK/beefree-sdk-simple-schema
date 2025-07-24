const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/html', limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Beefree Auth V2 Endpoint
app.post('/proxy/bee-auth', async (req, res) => {
  try {
    const { client_id, client_secret, uid } = req.body;
    
    if (!client_id || !client_secret) {
      return res.status(400).json({ 
        error: "Missing credentials",
        message: "client_id and client_secret are required" 
      });
    }

    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      { client_id, client_secret, uid: uid || 'default-uid' },
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Authentication failed",
      details: error.response?.data || error.message
    });
  }
});

// Health Check
app.get('/proxy/health', (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Builder available at http://localhost:${PORT}/index.html`);
});

// Error Handling
process.on('unhandledRejection', err => {
  console.error("Unhandled Rejection:", err);
});
