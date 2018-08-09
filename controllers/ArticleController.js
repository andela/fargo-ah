import cloudinary from 'cloudinary';
import Utilities from '../helpers/utilities';
import { Article, User } from '../models';
import createArticleHelper from '../helpers/createArticleHelper';

/**
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
    } = req.body.article;

    const { userId } = req;

    const articleObject = {
      title, description, body, tagList, imageUrl, userId
    };
    /**
     * check if image was provided in the request
     * upload the image to cloudinary, save the article
     * with the cloudinary URL in database but if an error
     * was encountered from cloudinary go ahead and create the article
     */
    if (imageUrl) {
      return cloudinary.v2.uploader.upload(imageUrl, { tags: 'basic_sample' })
        .then(image => createArticleHelper(res, articleObject, image.url))
        .catch(() => createArticleHelper(res, articleObject));
    }

    /**
     * if there no image was provided go ahead to create the article
    */
    return createArticleHelper(res, articleObject);
  }

  /**
   * get an article using slug as query parameter
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} - the found article from database or error if not found
   */
  static getArticle(req, res) {
    const { slug } = req.params;

    return Article
      .findOne({
        where: { slug, },
        include: [{
          model: User,
          attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
        }],
        attributes: { exclude: ['id', 'userId'] }
      })
      .then((article) => {
        /** if the article does not exist */
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
      .catch(() => res.status(501).send('oops  seems there is an error find the article'));
  }

  /**
   * get all articles created
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - pass to next middleware
   * @returns {object} - the found article from database or empty if not found
   */
  static listAllArticles(req, res, next) {
    if (req.query.uid || req.query.tag || req.query.title) {
      return next();
    }
    return Article
      .findAll({
        include: [{
          model: User,
          attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
        }],
        attributes: { exclude: ['id', 'userId'] }
      })
      .then((articles) => {
        /** check if there was no article created */
        if (articles.length === 0) {
          return res.status(200).json({
            message: 'Your request was successful but no articles created',
            articles,
          });
        }

        return res.status(200).json({ articles, articlesCount: articles.length });
      })
      .catch(() => res.status(501).send('oops  seems there is an error find all articles'));
  }

  /**
   * @function editArticle
  * @summary: API controller to handle requests
  * to edit an article
  * @param {object} req: request object
  * @param {object} res: response object
  * @returns {object} api response: article object for
  * successful requests, or error object for
  * requests that fail
  */
  static editArticle(req, res) {
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
    const { slug } = req.params;
    Article.destroy({
      where: { slug }
    })
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
  }
}

export default ArticleController;
