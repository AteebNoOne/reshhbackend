const db = require("../contact/contact.db");

async function generateBookingId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    let isUnique = false;

    while (!isUnique) {
        randomString = '';
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
        isUnique = await isBookingIdUnique(randomString);
    }

    return randomString;
}

async function isBookingIdUnique(bookingId) {
    const bookingIds = await db.Booking.getAllBookingIds();
    return !bookingIds.includes(bookingId);
}

module.exports = generateBookingId;
