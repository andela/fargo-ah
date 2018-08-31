import generateUniqueSlug from './generateUniqueSlug';
import { Article, User } from '../models';


/**
 * @description an helper function to help create article in database
 * @param {object} res - response object
 * @param {object} articleObject - contains extracted article fields
 * @param {string} imageUrl - image url from cloudinary
 * @returns object - the created article from the database
 */

const createArticleHelper = (res, articleObject, imageUrl = null) => {
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
    }))
    .then(article => res.status(201).json({ article }));
};

export default createArticleHelper;
