import db from '../models';
import utils from '../helpers/utilities';

const { Comment, User, Reply } = db;

/** * Class representing comments */
export default class CommentsController {
  /**
   * @function createComment
   * @summary Allows a user create comment
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - to handle errors
   * @returns {object} status code 201 with comment created if successful
   */
  static createComment(req, res, next) {
    const { body } = req.body.comment;
    Comment.create({
      userId: req.userId,
      articleId: req.articleObject.id,
      body
    })
      .then(comment => res.status(201).json({
        success: true,
        comment,
        user: utils.userToJson(req.userObject),
        article: req.articleObject,
      }))
      .catch(next);
  }

  /**
   * @function createReply
   * @summary Allows a user create comment
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - to handle errors
   * @returns {object} status code 201 with comment created if successful
   */
  static createReply(req, res, next) {
    const { body } = req.body.comment;
    Reply.create({
      userId: req.userId,
      commentId: req.params.id,
      body,
    })
      .then(reply => res.status(201).json({
        success: true,
        reply,
        user: utils.userToJson(req.userObject),
        comment: req.commentObject,
      }))
      .catch(next);
  }

  /**
   * @function getComments
   * @summary Get a single comment, the user and article related to it
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - to handle errors
   * @returns {object} status code 200 with comment if successful
   */
  static getComments(req, res, next) {
    Comment.findAll({
      include: [{
        model: User,
        attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] },
      }, {
        model: Reply,
        include: [{
          model: User,
          attributes: { exclude: ['id', 'email', 'hashedPassword', 'createdAt', 'updatedAt', 'lastname', 'bio'] },
        }]
      }],
      where: {
        articleId: req.articleObject.id,
      }
    })
      .then(comments => res.status(200).json({
        success: true,
        article: req.articleObject,
        comments,
      }))
      .catch(next);
  }

  /**
   * @function deleteComment
   * @summary Delete a single comment
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - to handle errors
   * @returns {object} status code 200 if successful
   */
  static deleteComment(req, res, next) {
    Comment.destroy({
      where: {
        id: req.params.id,
      }
    })
      .then(() => res.status(200).json({
        success: true,
        message: {
          body: ['Comment deleted successfully']
        }
      }))
      .catch(next);
  }
}
