<<<<<<< HEAD
import cloudinary from '../config/cloudinary';
=======
import cloudinary from 'cloudinary';
>>>>>>> ft(create-article): create user article
import Utilities from '../helpers/utilities';
import { Article, User } from '../models';
import createArticleHelper from '../helpers/createArticleHelper';

/**
<<<<<<< HEAD
 * Article class for users
 * @param {method} createArticle - Create article
 * @param {method} getArticle - Get a single article
 * @param {method} editArticle update a single article
*/
class ArticleController {
  /**
   * Create an article for a user
   * @param {object} req - The request object
   * @param {object} res - The response object sent to user
   * @return {object} A object containing created articles.
  */
  static createArticle(req, res) {
    const {
      title, description, body, tagList, imageData,
=======
     * Article class for users
     * @param {method} createArticle - Create article
     * @param {method} getArticle - Get a single article
     * @param {method} editArticle update a single article
    */
class ArticleController {
  /**
     * Create an article for a user
     * @param {object} req - The request object
     * @param {object} res - The response object sent to user
     * @return {object} A object containing created articles.
     */
  static createArticle(req, res) {
    const {
      title, description, body, tagList, imageUrl,
>>>>>>> ft(create-article): create user article
    } = req.body.article;

    const { userId } = req;

    const articleObject = {
<<<<<<< HEAD
      title, description, body, tagList, imageData, userId
=======
      title, description, body, tagList, imageUrl, userId
>>>>>>> ft(create-article): create user article
    };
    /**
     * check if image was provided in the request
     * upload the image to cloudinary, save the article
     * with the cloudinary URL in database but if an error
     * was encountered from cloudinary go ahead and create the article
<<<<<<< HEAD
    */
    if (imageData) {
      return cloudinary.v2.uploader.upload(imageData, { tags: 'basic_sample' })
=======
     */
    if (imageUrl) {
      return cloudinary.v2.uploader.upload(imageUrl, { tags: 'basic_sample' })
>>>>>>> ft(create-article): create user article
        .then(image => createArticleHelper(res, articleObject, image.url))
        .catch(() => createArticleHelper(res, articleObject));
    }

<<<<<<< HEAD
    // if there no image was provided go ahead to create the article
=======
    /**
     * if there no image was provided go ahead to create the article
    */
>>>>>>> ft(create-article): create user article
    return createArticleHelper(res, articleObject);
  }

  /**
   * get an article using slug as query parameter
   * @param {object} req - request object
   * @param {object} res - response object
<<<<<<< HEAD
   * @param {function} next - next function
   * @returns {object} - the found article from database or error if not found
  */
  static getArticle(req, res, next) {
=======
   * @returns {object} - the found article from database or error if not found
   */
  static getArticle(req, res) {
>>>>>>> ft(create-article): create user article
    const { slug } = req.params;

    return Article
      .findOne({
        where: { slug, },
        include: [{
          model: User,
          attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
        }],
<<<<<<< HEAD
        attributes: { exclude: ['userId'] }
      })
      .then((article) => {
        // if the article does not exist
=======
        attributes: { exclude: ['id', 'userId'] }
      })
      .then((article) => {
        /** if the article does not exist */
>>>>>>> ft(create-article): create user article
        if (!article) {
          return res.status(404).json({
            errors: {
              body: [
                'Ooops! the article cannot be found.'
              ]
            }
          });
        }

        return res.status(200).json({ article });
      })
<<<<<<< HEAD
      .catch(next);
=======
      .catch(() => res.status(501).send('oops  seems there is an error find the article'));
>>>>>>> ft(create-article): create user article
  }

  /**
   * get all articles created
   * @param {object} req - request object
   * @param {object} res - response object
<<<<<<< HEAD
   * @param {function} next - next function
   * @returns {object} - the found article from database or empty if not found
  */
  static listAllArticles(req, res, next) {
=======
   * @returns {object} - the found article from database or empty if not found
   */
  static listAllArticles(req, res) {
>>>>>>> ft(create-article): create user article
    return Article
      .findAll({
        include: [{
          model: User,
          attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
        }],
<<<<<<< HEAD
        attributes: { exclude: ['userId'] }
      })
      .then((articles) => {
        // check if there was no article created
        if (articles.length === 0) {
          return res.status(200).json({
            message: 'No articles created',
=======
        attributes: { exclude: ['id', 'userId'] }
      })
      .then((articles) => {
        /** check if there was no article created */
        if (articles.length === 0) {
          return res.status(200).json({
            message: 'Your request was successful but no articles created',
>>>>>>> ft(create-article): create user article
            articles,
          });
        }

        return res.status(200).json({ articles, articlesCount: articles.length });
      })
<<<<<<< HEAD
      .catch(next);
  }

  /**
  * @function editArticle
  * @summary: API controller to handle requests to edit an article
  * @param {object} req: request object
  * @param {object} res: response object
  * @param {function} next - next function
=======
      .catch(() => res.status(501).send('oops  seems there is an error find all articles'));
  }

  /**
   * @function editArticle
  * @summary: API controller to handle requests
  * to edit an article
  * @param {object} req: request object
  * @param {object} res: response object
>>>>>>> ft(create-article): create user article
  * @returns {object} api response: article object for
  * successful requests, or error object for
  * requests that fail
  */
<<<<<<< HEAD
  static editArticle(req, res, next) {
=======
  static editArticle(req, res) {
>>>>>>> ft(create-article): create user article
    const { title, description, body } = req.body.article;
    const { count } = req;
    const { slug } = req.params;
    return Article.update({
      title,
      description,
      body,
      updatedCount: Utilities.increaseCount(count)
    }, {
      where: {
        slug,
      },
      returning: true,
      plain: true
    })
      .then(result => res.status(200).json({
        success: true,
        article: result[1]
      }))
<<<<<<< HEAD
      .catch(next);
  }

  /**
  * @function deleteArticle
  * @summary: API controller to handle requests to delete an article
  * @param {object} req: request object
  * @param {object} res: response object
  * @param {function} next - next function
  * @returns {object} api response: article object for
  * successful requests, or error object for requests that fail
  */
  static deleteArticle(req, res, next) {
=======
      .catch((err) => {
        res.status(500).json({
          errors: {
            body: [
              'sorry there was an error updating this request',
              err
            ]
          }
        });
      });
  }

  /**
 * @function deleteArticle
* @summary: API controller to handle requests
* to delete an article
* @param {object} req: request object
* @param {object} res: response object
* @returns {object} api response: article object for
* successful requests, or error object for
* requests that fail
*/
  static deleteArticle(req, res) {
>>>>>>> ft(create-article): create user article
    const { slug } = req.params;
    Article.destroy({
      where: { slug }
    })
<<<<<<< HEAD
      .then(() => res.status(200).json({ message: 'Article successfully deleted' }))
      .catch(next);
=======
      .then(() => res.status(204).json())
      .catch(() => {
        res.status(500).json({
          errors: {
            body: [
              'sorry there was an error deleting this request',
            ]
          }
        });
      });
>>>>>>> ft(create-article): create user article
  }
}

export default ArticleController;
