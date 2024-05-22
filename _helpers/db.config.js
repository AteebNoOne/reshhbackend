const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.ReshhHost,
    user: process.env.ReshhUser,
    password: process.env.ReshhPassword,
    database: process.env.ReshhDatabase
});

module.exports = pool;
