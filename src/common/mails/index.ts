// const nodemailer = require("nodemailer");
import {
  NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD,
  NODEMAILER_HOST,
} from '@environments';
import * as nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(
  email: string | string[],
  subject: string,
  text: string,
  html?: string,
) {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();
    console.log(testAccount);

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: NODEMAILER_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: NODEMAILER_EMAIL, // generated ethereal user
        pass: NODEMAILER_PASSWORD, // generated ethereal password
      },
    });
    const to = typeof email === 'string' ? email : email.join(', ');
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Free Merchandise" ${NODEMAILER_EMAIL}`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {}
}

export { sendMail };
