import generateUniqueSlug from './generateUniqueSlug';
import { Article, User, Follow } from '../models';
import sendEmail from './sendEmail';
import { sendNotification, userData } from '../notification/index';


/**
 * @description an helper function to help create article in database
 * @param {object} res - response object
 * @param {object} articleObject - contains extracted article fields
 * @param {string} imageUrl - image url from cloudinary
 * @returns object - the created article from the database
 */

const createArticleHelper = (res, articleObject, imageUrl = null, next) => {
  let authorId, author, articleTitle, articleSlug, createdArticle;
  articleObject.price = (articleObject.price) ? articleObject.price.toFixed(2) : 0;
  const {
    title, description, body, tagList, userId, isPaidFor, price,
  } = articleObject;

  return Article
    .create({
      slug: generateUniqueSlug(title),
      title,
      description,
      body,
      userId,
      isPaidFor,
      price,
      tagList,
      imageUrl,
    })
    .then(article => Article.findById(article.id, {
      include: [{
        model: User,
        attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
      }],
      attributes: { exclude: ['id'] }
    }))
    .then((article) => {
      authorId = article.userId;
      articleTitle = article.title;
      articleSlug = article.slug;
      author = article.User.username;
      createdArticle = article;
      return Follow.findAll({
        where: { followId: authorId },
        include: [{
          model: User,
          as: 'myFollowers',
          attributes: ['email', 'id'],
        }],
        attributes: { exclude: ['id', 'userId', 'followId', 'createdAt', 'updatedAt'] },
        raw: true
      });
    })
    .then((users) => {
      const emails = users.map(user => user['myFollowers.email']);
      const followersId = users.map(user => user['myFollowers.id']);
      if (emails.length > 0 || followersId.length > 0) {
        sendEmail(emails, author, articleSlug);
        followersId.forEach((id) => {
          sendNotification(userData(articleTitle, author), id);
        });
      }
    })
    .then(() => {
      res.status(201).json({ article: createdArticle });
    })
    .catch(next);
};

export default createArticleHelper;
