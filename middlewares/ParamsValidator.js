/** Class for validating params */
export default class ParamsValidator {
  /**
   * Converts payload to JWT
   * @param {string} req - The request to be validated
   * @param {string} res - The response from validation
   * @param {string} next - The next function
   * @returns {boolean} if the username is alphanumeric or not
   */
  static validateUsername(req, res, next) {
    const alphaNumeric = /^[a-zA-Z0-9]+$/;
    const test = alphaNumeric.test(req.params.username);
    if (!test) {
      return res.status(400).json({
        success: false,
        errors: {
          body: ['Invalid username'],
        }
      });
    }
    next();
  }

  /**
   * Converts payload to JWT
   * @param {string} req - The request to be validated
   * @param {string} res - The response from validation
   * @param {string} next - The next function
   * @returns {boolean} if the username is alphanumeric or not
   */
  static validateId(req, res, next) {
    const isId = /^[0-9]*$/;
    const test = isId.test(req.userId);
    if (!test) {
      return res.status(400).json({
        success: false,
        errors: {
          body: ['Invalid id'],
        }
      });
    }
    next();
  }
}
