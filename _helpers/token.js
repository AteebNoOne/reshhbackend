const dotenv = require('dotenv');

dotenv.config();

const reshhSecret = process.env.ReshhSecret;

module.exports = reshhSecret;