const util = require('util');
const pool = require('../_helpers/db.config');
const { createPricesTable, createBookingTable, createUserTable } = require('../functions/createTables');

createUserTable();
createPricesTable();
createBookingTable();


const db = {
    Booking: {
        create: async (bookingData) => {
            const { bookingId, venue, venueCode, firstName, lastName, email, phone, notes, additionalGuests, dates,receipt } = bookingData;
            const query = 'INSERT INTO bookings (bookingId, venue,venueCode,firstName, lastName, email, phone, notes, additionalGuests, dates,receipt) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?,?,?)';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId, venue, venueCode, firstName, lastName, email, phone, notes, additionalGuests, JSON.stringify(dates),JSON.stringify(receipt)]);
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
        setOtp: async (otp, bookingId) => {
            const query = 'UPDATE bookings SET otp = ? WHERE bookingId = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [otp, bookingId]);
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
        verifyOtp: async (bookingId, email, otp) => {
            const query = 'SELECT * FROM bookings WHERE bookingId = ? AND email = ? AND otp = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query, [bookingId, email, otp]);
                return result;
            } catch (error) {
                return error;
            }
        }
    },
    Prices: {
        getAll: async () => {
            const query = 'SELECT * FROM prices';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const result = await queryAsync(query);
                return result;
            } catch (error) {
                return error;
            }
        },
        updatePriceById: async (id, updatedData) => {
            const queryAsync = util.promisify(pool.query).bind(pool);
            const { nightPrice, cleaningFee, managementFee, adminFee, maxGuests } = updatedData;
            // console.log("Updating...",id,updatedData)
            const query = `
                UPDATE prices 
                SET nightPrice = ?, cleaningFee = ?, managementFee = ?, adminFee = ?, maxGuests = ?
                WHERE id = ?
            `;
            try {
                const result = await queryAsync(query, [nightPrice, cleaningFee, managementFee, adminFee, maxGuests, id]);
                console.log("Update res?", result)
                return result;
            } catch (error) {
                console.log("ERROR?", error)
                return error;
            }
        }
    },
    User: {
        findByEmail: async (email) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            const queryAsync = util.promisify(pool.query).bind(pool);
            try {
                const results = await queryAsync(query, [email]);
                return results.length > 0 ? results[0] : null; // Return the user object or null if not found
            } catch (error) {
                console.error('Database error:', error);
                throw error;
            }
        },
        updatePassword: async (userId, newPassword) => {
            try {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Update password in database
                const query = 'UPDATE users SET password = ? WHERE id = ?';
                const queryAsync = util.promisify(pool.query).bind(pool);
                await queryAsync(query, [hashedPassword, userId]);

                return { message: 'Password updated successfully.' };
            } catch (error) {
                console.error('Database error:', error);
                throw error;
            }
        }
    }
};

module.exports = db;
