import sendgrid from '@sendgrid/mail';

import commentNotificationTemplate from './commentNotifyTemplate';
import { sendNotification } from '../notification';


/**
 * @description function to create a string of emails of users that liked an article,
 * generate template and send mail to the users
 * @function commentNotifier
 * @param {object} commentDetails - all details of the comment created
 * @returns {undefined} - no data returned
 */
export const commentNotifier = (commentDetails) => {
  const users = commentDetails.article.likes;

  // generate a string of emails for users that liked the article
  const usersEmails = users.map(el => el.User.email).join(', ');

  // generate firebase notification
  const payload = {
    app: 'Author\'s Haven',
    articleTitle: commentDetails.article.title,
    source: 'comments',
    comment: commentDetails.comment.body,
    commentBy: commentDetails.user.user.username,
    createdAt: Date.now(),
    read: false
  };

  users.forEach(user => sendNotification(payload, user.id));

  // generate the email template with comment details
  const email = commentNotificationTemplate(commentDetails);

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: usersEmails,
    from: '"Authors haven" <noreply@authorhaven.sims.com>',
    subject: 'A New Comment on Article!',
    text: 'this is  text',
    html: email,
    asm: {
      groupId: 7241,
    },
  };
  sendgrid.send(msg);
};

/**
 * @description function to create a string of emails of users that liked an article,
 * generate template and send mail to the users
 *  send notifications to firebase database for user
 * @function replyNotifier
 * @param {object} replyData - all details of the reply created
 * @returns {undefined} - no data returned
 */

export const replyNotifier = (replyData) => {
  const payload = {
    app: 'Author\'s Haven',
    source: 'reply',
    replyFrom: replyData.user.user.username,
    content: replyData.reply.body,
    createdAt: Date.now(),
    responseToComment: replyData.comment.body
  };

  sendNotification(payload, replyData.comment.userId);
};
