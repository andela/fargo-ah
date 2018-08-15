import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import mailtemplate from './mailtemplate';

exports.sendEmail = async (userToBeVerified) => {
  const token = jwt.sign(
    { id: userToBeVerified.id },
    process.env.SECRETE_KEY, { expiresIn: 60 * process.env.VERIFYTOKEN_EXPIRY }
  );

  // create template link
  const templateLink = `${process.env.URL_HOST}${token}`;
  const htmlTempate = mailtemplate.emailTemplate(templateLink);
  const mailOptions = {
    from: `"Authors haven" <${process.env.NO_REPLY_MAIL}>`,
    to: userToBeVerified.email,
    subject: 'Verify your email on Authors ✔',
    text: 'A writers dream an authors haven',
    html: htmlTempate // html body
  };

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount(() => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    // setup email data with unicode symbols
    transporter.sendMail(mailOptions).then(result => winston.info(result));
  });
};
