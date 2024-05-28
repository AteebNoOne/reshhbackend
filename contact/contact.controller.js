const express = require('express');
const router = express.Router();
const contactServices = require('./contact.service');


router.post('/', async (req, res) => {
    const { venue,firstName, lastName,email, phone,notes,additionalGuests,dates } = req.body;
    try {
        if (!venue && !firstName && !lastName && !email && !phone,!dates) {
            return res.status(400).json({ message: "FirstName, LastName,Email, Phone, and Dates are required" });
        }
        const formSubmission = await contactServices.submitQuote(venue,firstName, lastName,email, phone,notes,additionalGuests,dates );
        if(formSubmission === "Booking Request submitted successfully!"){
          try{
           const client= await contactServices.informClient(email)
          }
          catch(error){
            console.log("Error informing client",error)
          }
        }
        res.status(200).json({ message: formSubmission ,success:true});
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});

module.exports = router;
