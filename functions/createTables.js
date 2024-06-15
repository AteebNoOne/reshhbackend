const pool = require('../_helpers/db.config');
const bcrypt = require('bcryptjs');

function createBookingTable() {
    const createBookingTableQuery = `
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bookingId VARCHAR(255) UNIQUE,
            venue VARCHAR(255),
            venueCode VARCHAR(255),
            firstName VARCHAR(255),
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL,
            notes VARCHAR(255),
            additionalGuests VARCHAR(255),
            otp VARCHAR(6) DEFAULT NULL,
            dates JSON,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    pool.query(createBookingTableQuery, (err, result) => {
        if (err) {
            console.error('Bookings - Error creating table:', err);
        } else {
            console.log('Table "Bookings" has been created successfully.');
        }
    });
}

function createPricesTable() {
    const createPricesTableQuery = `
        CREATE TABLE IF NOT EXISTS prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            venue VARCHAR(255) UNIQUE,
            nightPrice INT(10),
            cleaningFee INT(10),
            managementFee INT(10),
            adminFee INT(10),
            maxGuests INT(10),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    pool.query(createPricesTableQuery, (err, result) => {
        if (err) {
            console.error('Prices - Error creating table:', err);
        } else {
            console.log('Table "Prices" has been created successfully.');
            try {
                insertSampleRecords();
            }
            catch (e) {

            }
        }
    });
}

function createUserTable() {
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            accessToken VARCHAR(255),
            otp VARCHAR(6),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    pool.query(createUserTableQuery, (err, result) => {
        if (err) {
            console.error('User - Error creating table:', err);
        } else {
            console.log('Table "Users" has been created successfully.');
            insertUser()
        }
    });
}


function insertSampleRecords() {
    const insertRecordsQuery = `
        INSERT INTO prices (venue, nightPrice, cleaningFee, managementFee, adminFee, maxGuests) VALUES
        ('The Beach Cottage', 440, 475, 150, 350, 8),
        ('The Retreat', 1239, 675, 200, 650, 14),
        ('The Oasis', 1595, 675, 200, 650, 18)
    `;

    pool.query(insertRecordsQuery, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Data Already Inserted');
            } else {
                console.error('Error inserting records:', err);
            }
        } else {
            console.log('Sample records have been inserted successfully.');
        }
    });
}

function insertUser() {
    const email = 'ateebnoone@gmail.com';
    const password = 'Res$h*2*2';

    // Hash password using bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        const insertUserQuery = `
            INSERT INTO users (email, password) VALUES (?, ?)
        `;
        const values = [email, hashedPassword];

        pool.query(insertUserQuery, values, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.error('User with this email already exists');
                } else {
                    console.error('Error inserting user:', err);
                }
            } else {
                console.log('User inserted successfully.');
            }
        });
    });
}

module.exports = {
    createUserTable,
    createBookingTable,
    createPricesTable,
    insertSampleRecords
};