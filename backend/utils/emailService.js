const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendEmail };
