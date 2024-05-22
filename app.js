const express = require('express');
const cors = require('cors');
const contactController = require('./contact/contact.controller')
const bodyParser = require('body-parser');
const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/booking',contactController);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});



