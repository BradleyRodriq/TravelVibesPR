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

// Function to send an email to users when an experience is added that matches their vibes
const sendExperienceEmail = async (user, experience) => {
  const experienceUrl = 'http://18.188.147.99:5000/experience/' + experience._id;

  const mailOptions = {
    from: 'TravelVibesPR <travelvibespr@gmail.com>',
    to: user.email,
    subject: 'New Experience Match!',
    text: `A new experience, "${experience.name}", has been added that matches your vibes.\n\nCheck it out on TravelVibesPR: ${experienceUrl}`,
  };
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

module.exports = sendExperienceEmail;

