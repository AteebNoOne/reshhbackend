const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const contactController = require('./contact/contact.controller');

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://reshhproperties.com");
  next();
});

// API routes
app.use('/api/booking', contactController);

// Serve static files from 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
