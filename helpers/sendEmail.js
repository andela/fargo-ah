import sendgrid from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import mailtemplate from './articleTemplate';
import template from './resetMailtemplate';
import emailtemplate from './mailtemplate';
/**
   * @param {array} emails - array of receivers' email
   * @param {string} name - name of author
   * @param {string} slug - unique slug of posted article
   * @param {string} callback - return value after sending mail
   * @returns {error} -  error if email is not sent
   */
export const sendMailArticle = (emails, name, slug, callback) => {
  setTimeout(() => {
    const templateLink = `${process.env.FRONTEND_HOST_URL}/articles/${slug}`;

    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emails,
      from: 'Authors haven <noreply@authorhaven.sims.com>',
      subject: 'See what you are missing out on!',
      text: 'this is  text',
      html: mailtemplate.emailTemplate(templateLink, name),
      asm: {
        groupId: 7240
      },
    };
    sendgrid.sendMultiple(msg);
    if (callback) callback('Mail address not found');
  }, 1000);
};

export const sendMailReset = (email, username, token) => {
  setTimeout(() => {
    const url = `${process.env.FRONTEND_HOST_URL}/password/reset/edit?token=${token}`;
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'Authors haven <noreply@authorhaven.sims.com>',
      subject: 'Reset Your Password!',
      text: 'this is text',
      html: template.emailTemplate(username, url, token),
    };
    sendgrid.sendMultiple(msg);
  }, 1000);
};

export const sendMailVerify = (userToBeVerified) => {
  const token = jwt.sign(
    { id: userToBeVerified.id },
    process.env.SECRET_KEY, { expiresIn: 60 * process.env.VERIFYTOKEN_EXPIRY }
  );
  // create template link
  const templateLink = `${process.env.URL_HOST}${token}/`;
  const htmlTempate = emailtemplate.emailTemplate(templateLink);
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
