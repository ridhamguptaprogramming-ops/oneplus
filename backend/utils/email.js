const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

exports.sendEmail = async (options) => {
  const transporter = createTransporter();

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  await transporter.sendMail(message);
};

exports.sendVerificationEmail = async (user, verificationUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content p { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { background: #f7fafc; padding: 20px 30px; text-align: center; }
        .footer p { color: #a0aec0; font-size: 14px; margin: 0; }
        .link-box { background: #edf2f7; border-radius: 8px; padding: 15px; word-break: break-all; font-size: 14px; color: #4a5568; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to EventFlow!</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Thank you for signing up! Please verify your email address to get started with EventFlow.</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #718096;">Or copy and paste this link into your browser:</p>
          <div class="link-box">${verificationUrl}</div>
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await exports.sendEmail({
    to: user.email,
    subject: 'Verify Your Email - EventFlow',
    html,
    text: `Hi ${user.name},\n\nPlease verify your email by clicking the link below:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
  });
};

exports.sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content p { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { background: #f7fafc; padding: 20px 30px; text-align: center; }
        .footer p { color: #a0aec0; font-size: 14px; margin: 0; }
        .link-box { background: #edf2f7; border-radius: 8px; padding: 15px; word-break: break-all; font-size: 14px; color: #4a5568; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #718096;">Or copy and paste this link into your browser:</p>
          <div class="link-box">${resetUrl}</div>
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await exports.sendEmail({
    to: user.email,
    subject: 'Password Reset - EventFlow',
    html,
    text: `Hi ${user.name},\n\nReset your password by clicking:\n${resetUrl}\n\nThis link expires in 1 hour.`,
  });
};

exports.sendTicketConfirmation = async (user, event, registration, ticketUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content p { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .ticket-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; color: #ffffff; margin: 20px 0; }
        .ticket-box h2 { margin: 0 0 10px 0; font-size: 22px; }
        .ticket-box p { margin: 5px 0; color: #e2e8f0; font-size: 15px; }
        .button { display: inline-block; background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { background: #f7fafc; padding: 20px 30px; text-align: center; }
        .footer p { color: #a0aec0; font-size: 14px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You're Registered!</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Your registration for <strong>${event.title}</strong> has been confirmed. Here are your event details:</p>
          <div class="ticket-box">
            <h2>${event.title}</h2>
            <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Venue:</strong> ${event.venue.name}, ${event.venue.address}</p>
            <p><strong>Ticket ID:</strong> ${registration.ticketId}</p>
          </div>
          <div style="text-align: center;">
            <a href="${ticketUrl}" class="button">View Ticket</a>
          </div>
          <p style="font-size: 14px; color: #718096; margin-top: 30px;">Please show your QR code at the entrance for check-in. We look forward to seeing you there!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await exports.sendEmail({
    to: user.email,
    subject: `Your Ticket for ${event.title} - EventFlow`,
    html,
    text: `Hi ${user.name},\n\nYou're registered for ${event.title}!\nDate: ${event.startDate}\nVenue: ${event.venue.name}\nTicket ID: ${registration.ticketId}`,
  });
};

