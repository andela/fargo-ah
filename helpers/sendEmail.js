import sendgrid from '@sendgrid/mail';

import mailtemplate from './articleTemplate';

/**
   * @param {array} emails - array of receivers' email
   * @param {string} name - name of author
   * @param {string} slug - unique slug of posted article
   * @param {string} callback - return value after sending mail
   * @returns {error} -  error if email is not sent
   */
export default (emails, name, slug, callback) => {
  setTimeout(() => {
    const templateLink = `${process.env.URL_HOST}/${slug}`;

    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emails,
      from: '"Authors haven" <noreply@authorhaven.sims.com>',
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
