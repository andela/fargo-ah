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
    if (req.params.username && req.params.username.trim().length <= 2) {
      return res.status(400).json({
        success: false,
        errors: {
          body: ['Invalid username'],
        }
      });
    }
    next();
    // const alphaNumeric = /^[a-zA-Z0-9]+$/;
    // const test = alphaNumeric.test(req.params.username);
    // if (!test) {
    //   return res.status(400).json({
    //     success: false,
    //     errors: {
    //       body: ['Invalid username'],
    //     }
    //   });
    // }
  }

  /**
   * Converts payload to JWT
   * @param {string} req - The request to be validated
   * @param {string} res - The response from validation
   * @param {string} next - The next function
   * @returns {boolean} if the user id is alphaintegernumeric or not
   */
  static validateId(req, res, next) {
    const isId = /^[0-9]*$/;
    const test = isId.test(req.userId);
    if (!test) {
      return res.status(403).json({
        success: false,
        errors: {
          body: ['Invalid id'],
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
   * @returns {boolean} if the params id is integer or not
   */
  static validateParamId(req, res, next) {
    const isId = /^[0-9]*$/;
    const test = isId.test(req.params.id);
    if (!test) {
      return res.status(403).json({
        success: false,
        errors: {
          body: ['Invalid id'],
        }
      });
    }
    next();
  }

  /**
   * Checks the  page params provided for integer 1 and above
   *  and assign a default value when less than 1
   * @param {string} req - The request to be validated
   * @param {string} res - The response from validation
   * @param {string} next - The next function
   * @returns {undefined}
   */
  static validatePageQuery(req, res, next) {
    let { page, limit } = req.query;
    console.log('queryguy', req.query);

    if (page || limit) {
      page = Number(page);
      limit = Number(limit);

      req.page = (page < 1 || !Number.isInteger(page)) ? 1 : page;
      req.limit = (limit < 1 || !Number.isInteger(limit)) ? 10 : limit;
    }
    next();
  }
}
