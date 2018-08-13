import stripePackage from 'stripe';
import db from '../models';
import utils from '../helpers/utilities';

const { Payment } = db;
/** * Class representing payments */
export default class PaymentController {
  /**
  * Gets a stripe object for processing
  * @returns {object} a stripe object
  */
  static getStripe() {
    return stripePackage(process.env.STRIPE_SECRET_KEY);
  }

  /**
  * Opens up article for user if payment is successful
  * @param {*} req - Request object
  * @param {*} res - Response object
  * @param {function} next - for errors
  * @returns {link} redirects to create payment
  */
  static makePayment(req, res, next) {
    this.getStripe().customers.create({
      email: req.body.email,
      source: req.body.stripeToken
    })
      .then(customer => this.getStripe().charges.create({
        amount: req.body.amount * 100,
        description: `Payment for ${req.params.slug}`,
        currency: 'usd',
        customer: customer.id
      }))
      .then(res.redirect(307, `/api/pay/${req.params.slug}/success`))
      .catch(next);
  }

  /**
  * Opens up article for user if payment is successful
  * @param {*} req - Request object
  * @param {*} res - Response object
  * @param {function} next - for errors
  * @returns {boolean} representing if the payment was successful or not
  */
  static afterPayment(req, res, next) {
    const {
      amount,
      stripeToken,
      stripeTokenType,
      stripeEmail
    } = req.body;
    Payment.create({
      userId: req.userId,
      articleId: req.articleObject.id,
      amount,
      stripeToken,
      stripeTokenType,
      stripeEmail,
    })
      .then(() => res.status(200).json({
        payment: {
          message: 'Payment Successful',
          amount,
          article: req.articleObject,
          user: utils.userToJson(req.userObject),
        }
      }))
      .catch(next);
  }
}
