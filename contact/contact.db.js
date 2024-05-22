const util = require('util');
const pool = require('../_helpers/db.config')

function createBookingTable() {
    const createBookingTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(255),
            lastName VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(255) NOT NULL,
            notes VARCHAR(255),
            additionalGuests VARCHAR(255),
            dates JSON,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        )
    `;

    pool.query(createBookingTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "Bookings" has been created successfully.');
        }
    });
}

createBookingTable();

const db = {
    Booking: {
        create: async (bookingData) => {
            const { firstName, lastName,email, phone,notes,additionalGuests,dates } = bookingData;
            const query = 'INSERT INTO bookings (firstName,lastName,email,phone,notes,additionalGuests,dates) VALUES (?,?,?,?,?,?,?)';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [firstName, lastName,email, phone,notes,additionalGuests,dates]);
                return result;
            } catch (error) {
                return  error;
            }
        },
    },
};

module.exports = db;