const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const db = require("./contact.db");
const getStyles = require("../functions/getStyles");

dotenv.config();

async function formatDate(dateString) {

  const date = new Date(dateString);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return dayName + " " + dayNumber + " " + month + " " + year
}
  


async function submitQuote(venue, firstName, lastName, email, phone, notes, additionalGuests, dates,emailReceipt,req) {
  const start = await formatDate(dates.startDate);
  const end = await formatDate(dates.endDate);

  let transporter = nodemailer.createTransport({
    host: process.env.ReshhEmailHost,
    port: process.env.ReshhEmailPort,
    secure: process.env.ReshhEmailSecured,
    auth: {
      user: process.env.ReshhEmailUser,
      pass: process.env.ReshhEmailPass
    }
  });


  let mailOptions = {
    from: `"Reshh Properties Bookings" <${process.env.ReshhEmailUser}>`,
    to: process.env.ReshhEmailTo,
    subject: "New Booking Received",
    html: `
 ${await getStyles()}
        
        <div class="container">
  <img class="logoImage" width="100" height="100" src="https://reshhproperties.designolance.com/wp-content/uploads/2024/02/PNG-01-1536x1485.png" alt="Reshh Properties Logo" />
  <h3>Venue: ${venue} </h2>
  <p>First Name: ${firstName}</p>
  <p>Last Name: ${lastName}</p>
         <p>Email: ${email}</p>
         <p>Phone Number: ${phone}</p>
         <p>Additional guests : ${additionalGuests} </p>
         <p>Message: ${notes}</p>
         <p>Start date: ${start} </p>
         <p>End date: ${end}</p>
         ${emailReceipt}
</div>`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return "Booking Request submitted successfully!"
  } catch (err) {
    console.error("Email sending error:", err);
    
    throw new Error("Failed to submit quote. Please try again later.");
  }
}


async function informClient(email, bookingId,req) {
    // Construct iframe URL
    let iframeUrl = `${req.protocol}://${req.get('host')}/reshhsummary/receipts/${bookingId}`;

  let transporter = nodemailer.createTransport({
    host: process.env.ReshhEmailHost,
    port: process.env.ReshhEmailPort,
    secure: process.env.ReshhEmailSecured,
    auth: {
      user: process.env.ReshhEmailUser,
      pass: process.env.ReshhEmailPass
    }
  });

  let mailOptions = {
    from: `"Reshh Properties" <${process.env.ReshhEmailUser}>`,
    to: email,
    subject: "Booking Request Confirmation",
    html: `
 ${await getStyles()}

<div class="container">
  <img class="logoImage" width="100" height="100" src="https://reshhproperties.designolance.com/wp-content/uploads/2024/02/PNG-01-1536x1485.png" alt="Reshh Properties Logo" />

  <p>Dear ${email},</p>
  <p>Thank you for requesting a booking from Reshh Properties. Your request has been successfully received.</p>
  <p>We will review your request and get back to you as soon as possible.</p>
 <p>Best regards,</p>
  <p>Reshh Properties Team</p>
    <a href=${iframeUrl}>Click here to see receipt</a>
  


  <p class="disclaimer">This is a system-generated email and replies to this address are not monitored. Please don't reply to this message. For any inquiries, contact us at <a href="mailto:${process.env.ReshhEmailTo}">${process.env.ReshhEmailTo}</a>.</p>
</div>

        `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return "Confirmation email sent successfully!";
  } catch (err) {
    console.error("Confirmation email sending error:", err);
    throw new Error("Failed to send confirmation email. Please try again later.");
  }
}


async function informClientAboutCancel(email, data) {
  let transporter = nodemailer.createTransport({
    host: process.env.ReshhEmailHost,
    port: process.env.ReshhEmailPort,
    secure: process.env.ReshhEmailSecured,
    auth: {
      user: process.env.ReshhEmailUser,
      pass: process.env.ReshhEmailPass
    }
  });

  let mailOptions = {
    from: `"Reshh Properties" <${process.env.ReshhEmailUser}>`,
    to: email,
    subject: "Booking Cancelled",
    html: `

 ${await getStyles()}
<div class="container">
  <img class="logoImage" width="100" height="100" src="https://reshhproperties.designolance.com/wp-content/uploads/2024/02/PNG-01-1536x1485.png" alt="Reshh Properties Logo" />

  <p>Dear ${email},</p>
  <p>The booking you made for ${data[0].venue} was cancelled succesfully.</p>
  <p>Best regards,</p>
  <p>Reshh Properties Team</p>

  <p class="disclaimer">This is a system-generated email and replies to this address are not monitored. Please don't reply to this message. For any inquiries, contact us at <a href="mailto:${process.env.ReshhEmailTo}">${process.env.ReshhEmailTo}</a>.</p>
</div>

        `,
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent: %s", info.messageId);
    return "Confirmation email sent successfully!";
  } catch (err) {
    console.error("Confirmation email sending error:", err);
    throw new Error("Failed to send confirmation email. Please try again later.");
  }
  };





async function verifyBookingId(bookingId) {
  try {
    const bookingIds = await db.Booking.getAllBookingIds();
    const success = bookingIds.includes(bookingId);
    return { success };
  } catch (error) {
    console.error('Error verifying booking ID:', error);
    return { success: false };
  }
}



async function sendOtp(otp, email) {
  let transporter = nodemailer.createTransport({
    host: process.env.ReshhEmailHost,
    port: process.env.ReshhEmailPort,
    secure: process.env.ReshhEmailSecured,
    auth: {
      user: process.env.ReshhEmailUser,
      pass: process.env.ReshhEmailPass
    }
  });

  let mailOptions = {
    from: `"Reshh Properties" <${process.env.ReshhEmailUser}>`,
    to: email,
    subject: "Booking Cancelation Request",
    html: `
 ${await getStyles()}

<div class="container">
<img class="logoImage" width="100" height="100" src="https://reshhproperties.designolance.com/wp-content/uploads/2024/02/PNG-01-1536x1485.png" alt="Reshh Properties Logo" />

<p>Dear ${email},</p>
<p>Your Otp is : <b>${otp}</b></p>
<p>Best regards,</p>
<p>Reshh Properties Team</p>


<p class="disclaimer">This is a system-generated email and replies to this address are not monitored. Please don't reply to this message. For any inquiries, contact us at <a href="mailto:${process.env.ReshhEmailTo}">${process.env.ReshhEmailTo}</a>.</p>
</div>

      `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Otp email sent: %s", info.messageId);
    return "Otp email sent successfully!";
  } catch (err) {
    console.error("Otp email sending error:", err);
    throw new Error("Failed to send Otp email. Please try again later.");
  }
}

module.exports = {
  submitQuote, informClient, verifyBookingId, sendOtp,informClientAboutCancel
};

{/* <p>If it was a mistake, you can cancel your booking anytime</p>
<p>To cancel your reservation, please visit <a href='https://bookings.reshhproperties.com/cancel?id=${bookingId}' target='_blank'>Cancel Now</a></p>
  */}