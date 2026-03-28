const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Send push notification via Firebase
const sendPushNotification = async (fcmToken, notification) => {
  try {
    if (!fcmToken) return false;
    
    const message = {
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'petpal_notifications',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    };
    
    const response = await admin.messaging().send(message);
    console.log('Push notification sent:', response);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Send email notification
const sendEmailNotification = async (email, data) => {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    const mailOptions = {
      from: `"PetPal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: data.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0d9488; padding: 20px; text-align: center;">
            <h1 style="color: white;">🐾 PetPal</h1>
          </div>
          <div style="padding: 20px;">
            <h2>${data.subject}</h2>
            <p style="font-size: 16px; line-height: 1.5;">${data.message}</p>
            ${data.actionUrl ? `
              <a href="${process.env.FRONTEND_URL}${data.actionUrl}" 
                 style="display: inline-block; background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                View Details
              </a>
            ` : ''}
            <hr style="margin: 30px 0;" />
            <p style="color: #666; font-size: 12px;">
              You're receiving this email because you have email notifications enabled in PetPal.
              <a href="${process.env.FRONTEND_URL}/settings">Manage preferences</a>
            </p>
          </div>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendPushNotification, sendEmailNotification };