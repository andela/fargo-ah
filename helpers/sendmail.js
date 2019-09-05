import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import mailtemplate from './mailtemplate';

const sendEmail = (userToBeVerified) => {
  const token = jwt.sign(
    { id: userToBeVerified.id },
    process.env.SECRET_KEY, { expiresIn: 60 * process.env.VERIFYTOKEN_EXPIRY }
  );

  // create template link
  const templateLink = `${process.env.URL_HOST}${token}/`;
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
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      transportMethod: 'SMTP',
      tls: {
        rejectUnauthorized: false
      }
    });
    // setup email data with unicode symbols
    transporter.sendMail(mailOptions).then(result => winston.info(result));
  });
};

const sendMailVerify = (userToBeVerified) => {
  const token = jwt.sign(
    { id: userToBeVerified.id },
    process.env.SECRET_KEY, { expiresIn: 60 * process.env.VERIFYTOKEN_EXPIRY }
  );
   // create template link
   const templateLink = `${process.env.URL_HOST}${token}/`;
   const htmlTempate = mailtemplate.emailTemplate(templateLink);
  setTimeout(() => {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const mailOptions = {
      from: `"Authors haven" <${process.env.NO_REPLY_MAIL}>`,
      to: userToBeVerified.email,
      subject: 'Verify your email on Authors ✔',
      text: 'A writers dream an authors haven',
      html: htmlTempate // html body
    };
    sendgrid.sendMultiple(mailOptions);
  }, 1000);
};
