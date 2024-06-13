const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const contactController = require('./contact/contact.controller');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const db = require('./contact/contact.db');

dotenv.config();

const port = process.env.PORT || 4001;

// Use helmet to secure the app by setting various HTTP headers
app.use(helmet());

// Custom helmet configuration to allow framing from specific origins
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    frameAncestors: ["'self'", "https://www.reshhproperties.com"]
  }
}));

// CORS configuration to allow specific origins
const allowedOrigins = ['https://www.reshhproperties.com', 'http://localhost:3000']; // Add your allowed origins here
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/booking', contactController);

// Catch-all route to serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
