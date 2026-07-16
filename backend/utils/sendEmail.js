const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  // If email credentials are not configured, just log and skip (dev mode)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[sendEmail] Skipped (no email config). To: ${to}, Subject: ${subject}`);
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Admissions Office" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

module.exports = sendEmail;
