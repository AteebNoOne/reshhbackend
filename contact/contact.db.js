const util = require('util');
const pool = require('../_helpers/db.config');

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
            const { bookingId, venue,venueCode,firstName, lastName, email, phone, notes, additionalGuests, dates } = bookingData;
            const query = 'INSERT INTO bookings (bookingId, venue,venueCode,firstName, lastName, email, phone, notes, additionalGuests, dates) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?,?)';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId,venue,venueCode, firstName, lastName, email, phone, notes, additionalGuests, JSON.stringify(dates)]);
                return result;
            } catch (error) {
                return error;
            }
        },        
        delete: async (bookingId) => {
            const query = 'DELETE FROM bookings WHERE bookingId = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId]);
                return result;
            } catch (error) {
                return error;
            }
        },
        getByVenue: async (venueCode) => {
            const query = 'SELECT * FROM bookings where venueCode = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [venueCode]);
                return result;
            } catch (error) {
                return error;
            }
        },
        getById: async (bookingId) => {
            const query = 'SELECT * FROM bookings where bookingId = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId]);
                return result;
            } catch (error) {
                return error;
            }
        },
        getAll: async () => {
            const query = 'SELECT * FROM bookings';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query);
                return result;
            } catch (error) {
                return error;
            }
        },
        getAllBookingIds: async () => {
            const query = 'SELECT bookingId FROM bookings';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query);
                return result.map(row => row.bookingId);
            } catch (error) {
                return error;
            }
        },
        verifyEmailWithBookingId: async (bookingId, email) => {
            const query = 'SELECT * FROM bookings WHERE bookingId = ? AND email = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId, email]);
                if (result.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return error;
            }
        },
        setOtp: async (otp,bookingId) => {
            const query = 'UPDATE bookings SET otp = ? WHERE bookingId = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [otp,bookingId]);
                return result;
            } catch (error) {
                return error;
            }
        }, 
        getOtp: async (email) => {
            const query = 'SELECT otp FROM bookings WHERE  email = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [email]);
                return result;
            } catch (error) {
                return error;
            }
        },
        verifyOtp: async (bookingId,email,otp) => {
            const query = 'SELECT * FROM bookings WHERE bookingId = ? AND email = ? AND otp = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId,email,otp]);
                return result;
            } catch (error) {
                return error;
            }
        }          
    },
};

module.exports = db;
