const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

async function formatDate(dateString) {
    
    const date = new Date(dateString);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return  dayName+" "+dayNumber+" "+month+" "+year
  }



async function submitQuote(firstName, lastName, email, phone, notes, additionalGuests, dates) {
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
        html: `<p>First Name: ${firstName}</p>
        <p>Last Name: ${lastName}</p>
               <p>Email: ${email}</p>
               <p>Phone Number: ${phone}</p>
               <p>Additional guests : ${additionalGuests} </p>
               <p>Message: ${notes}</p>
               <p>Start date: ${start} </p>
               <p>End date: ${end}</p>
               `
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


async function informClient(email) {
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
        <style>

  .container {
    padding: 20px;
    background-color: #f5f5f5; /* Light gray background for content */
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); 
    font-family: Arial, sans-serif;
    margin: 0;
    background-color: #fff; 
  }


  h2 {
    color: #333; /* Dark gray for headings */
    margin: 10px 0;
  }

  p {
    color: #666; /* Light gray for text */
    line-height: 1.5;
  }

  .disclaimer {
    font-size: smaller;
    color: #999; /* Even lighter gray for disclaimer */
    text-align: center;
    margin-top: 20px;
  }


  a {
    color: #3b82f6; /* Blue-300 color for links */
    text-decoration: none; /* Remove underline from links */
  }


  a:hover {
    text-decoration: underline; /* Underline link on hover */
  }

  .logoImage{
    width:100px;
    height:100px;
  }
</style>

<div class="container">
  <img class="logoImage" width="100" height="100" src="https://reshhproperties.designolance.com/wp-content/uploads/2024/02/PNG-01-1536x1485.png" alt="Reshh Properties Logo" />

  <p>Dear ${email},</p>
  <p>Thank you for requesting a booking from Reshh Properties. Your request has been successfully received.</p>
  <p>We will review your request and get back to you as soon as possible.</p>
  <p>Best regards,</p>
  <p>Reshh Properties Team</p>

  <h2>Summary</h2>
  <p>Soon..</p>

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
}

module.exports = {
    submitQuote, informClient
};