import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccount';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://authorshaven-6f524.firebaseio.com'
});

const ref = admin.database().ref('notifications');
export const sendNotification = (payload, followid) => {
  ref.child(`${followid}`).push(payload);
};

export const userData = (articleTitle, author) => {
  const payload = {
    articleTitle,
    source: 'article',
    createdBy: `${author}`,
    createdAt: Date.now(),
    read: false
  };
  return payload;
};
