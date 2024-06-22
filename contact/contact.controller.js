const express = require('express');
const router = express.Router();
const contactServices = require('./contact.service');
const db = require('./contact.db');
const { getAllUsedDates } = require('../functions/getAllUsedDates');
const generateBookingId = require('../functions/generateRandomString');
const generateOtp = require('../functions/generateOtp');
const { createReceipt } = require('../functions/createReceipt');


router.post('/', async (req, res) => {
  const { venue, firstName, lastName, email, phone, notes, additionalGuests, dates,receipt } = req.body;
  const bookingId = await generateBookingId()
  let venueCode = null;
  if (venue === 'The Beach Cottage') {
    venueCode = 'the-beach-cottage'
  }
  if (venue === 'The Retreat') {
    venueCode = 'the-retreat'
  }
  if (venue === 'The Oasis') {
    venueCode = 'the-oasis'
  }
  const bookingData = { venue, venueCode, bookingId, firstName, lastName, email, phone, notes, additionalGuests, dates,receipt }
  try {

    if (!venue && !firstName && !lastName && !email && !phone, !dates) {
      return res.status(400).json({ message: "Venue,FirstName, LastName,Email, Phone, and Dates are required" });
    }
    const postInDb = await db.Booking.create(bookingData)
    const emailReceipt = await createReceipt(bookingId,receipt);
    const formSubmission = await contactServices.submitQuote(venue, firstName, lastName, email, phone, notes, additionalGuests, dates,emailReceipt,req);
    if (formSubmission === "Booking Request submitted successfully!") {
      try {
        const client = await contactServices.informClient(email,bookingId,req)
      }
      catch (error) {
        console.log("Error informing client", error)
      }
    }
    res.status(200).json({ message: postInDb, success: true });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookings = await db.Booking.getAll()
    res.status(200).json({ message: "success", success: true, data: bookings });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.get('/used-dates', async (req, res) => {
  const { venue } = req.query;
  try {
    const dates = await getAllUsedDates(venue)
    res.status(200).json({ message: "success", success: true, data: dates });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.get('/prices', async (req, res) => {
  try {
    const prices = await db.Prices.getAll()
    res.status(200).json({ message: "success", success: true, data: prices });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});


router.put('/prices', async (req, res) => {
  const {id,venue,nightPrice,cleaningFee,managementFee,adminFee,maxGuests} = req.body;
  const updatedData = {venue,nightPrice,cleaningFee,managementFee,adminFee,maxGuests}
  try {
    const prices = await db.Prices.updatePriceById(id,updatedData)
    res.status(200).json({ message: "success", success: true, data: prices });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});


router.get('/verify-bookingId', async (req, res) => {
  const { bookingId } = req.query;
  try {
    const result = await contactServices.verifyBookingId(bookingId);

    if (result.success) {
      res.status(200).json({ message: "success", success: true });
    } else {
      res.status(404).json({ message: "Booking ID not found", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/delete-booking', async (req, res) => {
  const { bookingId } = req.body;
  try {
    const delREs = await db.Booking.delete(bookingId)
    res.status(200).json({ message: delREs, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});


router.post('/cancel-booking', async (req, res) => {
  const { bookingId, email } = req.body;
  try {
    const result = await db.Booking.verifyEmailWithBookingId(bookingId, email)
    if (result) {
      const otp = await generateOtp()
      const settingOtp = await db.Booking.setOtp(otp, bookingId);
      const otpSent = await contactServices.sendOtp(otp,email)
      res.status(200).json({ message: "success", success: true });
    }
    else {
      res.status(403).json({ message: "Email Not Associated. This booking was made with a different email.", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { bookingId, email, otp } = req.body;
  const data = await db.Booking.getById(bookingId)
  try {
    const result = await db.Booking.verifyOtp(bookingId, email, otp)
    if (result.length > 0) {
      const delREs = await db.Booking.delete(bookingId)
      const otpSent = await contactServices.informClientAboutCancel(email,data)
      res.status(200).json({ message: "success", success: true });
    }
    else {
      res.status(403).json({ message: "Wrong OTP Please Check your OTP Carefully!", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
