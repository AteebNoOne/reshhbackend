const express = require('express');
const cors = require('cors');
const contactController = require('./contact/contact.controller')
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const { getAllUsedDates } = require('./functions/getAllUsedDates');
const db = require('./contact/contact.db');

dotenv.config();

const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/booking', contactController);

// Catch-all route to serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware to set the Content-Security-Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://reshhproperties.com"
  );
  next();
});


// Middleware to set the X-Frame-Options header
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOW-FROM https://reshhproperties.com');
  next();
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});



