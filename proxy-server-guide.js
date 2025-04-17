
/**
 * SAMPLE PROXY SERVER GUIDE 
 * 
 * This is a reference implementation for your Express.js proxy server
 * Make sure your server has these endpoints and CORS configuration
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS for all routes - CRITICAL for your frontend to work
app.use(cors({
  origin: '*', // In production, restrict to your app domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY']
}));

app.use(express.json());

// Simple ping endpoint for connection testing
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Proxy server is running' });
});

// Generic proxy endpoint for any external API
app.all('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing target URL' });
    }
    
    const method = req.method.toLowerCase();
    const options = {
      method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host
      },
      data: method !== 'get' && method !== 'head' ? req.body : undefined
    };
    
    // Remove headers that would cause issues
    delete options.headers.host;
    delete options.headers.connection;
    
    const response = await axios(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

// Example dedicated endpoint for Binance
app.all('/binance/*', async (req, res) => {
  try {
    const path = req.path.replace('/binance', '');
    const baseUrl = 'https://api.binance.com';
    const url = `${baseUrl}${path}`;
    
    const method = req.method.toLowerCase();
    const response = await axios({
      method,
      url,
      params: req.query,
      data: method !== 'get' && method !== 'head' ? req.body : undefined,
      headers: {
        'X-MBX-APIKEY': req.headers['x-mbx-apikey']
      }
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Binance proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
