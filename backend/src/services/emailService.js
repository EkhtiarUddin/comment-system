const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Alternatively, for other email services:
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

const sendInvitationEmail = async (email, invitationToken) => {
  const invitationLink = `${process.env.FRONTEND_URL}/invitation/${invitationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@commentsystem.com',
    to: email,
    subject: 'Invitation to Join Our Comment System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3498db;">You're Invited!</h2>
        <p>You've been invited to join our comment system. Click the link below to complete your registration:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Registration
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${invitationLink}</p>
        <p>This invitation link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          If you didn't request this invitation, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Invitation email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Test email connection (optional)
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
};

module.exports = { sendInvitationEmail, testEmailConnection };
