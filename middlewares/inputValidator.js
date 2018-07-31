import validateUser from '../helpers/validate';

/** * Class validating user inputs */
export default class userValidator {
  /**
  * validates email
  * @callback next
  * @param {object} req - Request object
  * @param {Object} res - Response object
  * @param {next} next - Next route handler
  * @returns {Object} failure message
  */
  static validateEmail(req, res, next) {
    const checkEmail = validateUser.validateEmail(req.body.user.email);
    if (checkEmail.error) {
      return res.status(422).json({ errors: { body: [checkEmail.error] } });
    }
    next();
  }

  /**
  * validates password
  * @callback next
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {next} next - Next route handler
  * @returns {Object} failure message
  */
  static validatePassword(req, res, next) {
    const checkPassword = validateUser.validatePassword(req.body.user.password);
    if (checkPassword.error) {
      return res.status(400).json({ errors: { body: [checkPassword.error] } });
    }
    next();
  }
}
