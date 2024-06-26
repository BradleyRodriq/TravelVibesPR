const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
const sendSignupEmail = async (user) => {
  const mailOptions = {
    from: 'TravelVibesPR <travelvibespr@gmail.com>',
    to: user.email,
    subject: 'Thank you for signing up!',
    text: 'Welcome to TravelVibesPR! We are excited to have you as a member of our community.'
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendSignupEmail;
