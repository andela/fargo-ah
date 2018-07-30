import jwt from 'jsonwebtoken';

/** Class representing all utility functions */
export default class Utilities {
/**
 * Converts payload to JWT
 * @param {Object} payload - Object to convert to JWT
 * @returns {string} token - JWT String created.
 */
  static signToken(payload) {
    try {
      return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: '24h' }).toString();
    } catch (err) {
      return err;
    }
  }

  /**
 * Returns user object
 * @param {Object} userObject - userObject returned from the database.
 * @param {string} token - String
 * @returns {Object} user object
 */
  static userToJson(userObject, token = null) {
    let output;
    if (token === null) {
      output = {
        success: true,
        user: {
          email: userObject.email,
          username: userObject.username,
          bio: userObject.bio,
          image: userObject.image,
        },
      };
    } else {
      output = {
        success: true,
        user: {
          email: userObject.email,
          token,
          username: userObject.username,
          bio: userObject.bio,
          image: userObject.image,
        },
      };
    }
    return output;
  }

  /**
   * @function increaseCount
  * @summary: API controller to handle requests
  * to delete an article
  * @param {Integer} num: input param
  * @returns {object} api response: article object for
  * successful requests, or error object for
  * requests that fail
  */
  static increaseCount(num) {
    if (Number.isInteger(num)) {
      let updateCount = num;
      updateCount += 1;
      return updateCount;
    }
  }
}
