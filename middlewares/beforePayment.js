import { Op } from 'sequelize';
import db from '../models';

const { Payment } = db;

/**
  * Processes payment for a user
  * @param {*} req - Request object
  * @param {*} res - Response object
  * @param {function} next - for errors
  * @returns {boolean} representing if the payment was successful or not
  */
const beforePayment = (req, res, next) => {
  Payment.find({
    where: {
      [Op.and]: [
        { userId: req.userId },
        { articleId: req.articleObject.id }
      ],
    },
  })
    .then((payment) => {
      if (!payment) {
        next();
      }
      return res.status(400).json({
        success: false,
        errors: {
          body: ['You already purchased this article']
        }
      });
    })
    .catch(next);
};

export default beforePayment;
