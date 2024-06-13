const moment = require('moment'); // Import the moment library for date manipulation
const db = require('../contact/contact.db');


async function getAllUsedDates(venueCode) {
    try {
        const bookings = await db.Booking.getByVenue(venueCode)

        let usedDates = [];

        // Loop through each booking
        bookings.forEach(booking => {
            const { startDate, endDate } = JSON.parse(booking.dates); // Parse dates from JSON string
            const start = moment(startDate); // Convert startDate to moment object
            const end = moment(endDate); // Convert endDate to moment object

            // Loop through each date in the range and add it to the usedDates array
            for (let date = moment(start); date.isSameOrBefore(end); date.add(1, 'days')) {
                usedDates.push(date.toISOString()); // Format date and push to array
            }
        });

        return usedDates;
    } catch (error) {
        console.error('Error retrieving used dates:', error);
        throw error;
    }
}

module.exports = {
    getAllUsedDates
};
