/** validate userInput */
export default class ValidateUser {
/**
 *
 * @param {string} str
 * @returns {object} return
 * validate username field input *
 */
  static validateEmail(str) {
    if (!str || str.trim().length < 1) {
      return { error: 'Email cannot be empty' };
    }

    const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
    if (!emailRegex.test(str.trim())) {
      return { error: 'Invalid email format' };
    }
    return {};
  }

  /**
   *
 *
 * @param {string} str
 * @returns {object} return
 * validate username field input *
 */
  static validateUsername(str) {
    if (!str || str.trim().length < 1) {
      return { error: 'username cannot be empty' };
    }

    if (str.trim().length < 5) {
      return { error: 'username must not be less than 5 characters' };
    }
    return {};
  }

  /**
 *
 * @param {string} str
 * @returns {object} returns
 * validate username field input *
 */
  static validatePassword(str) {
    const passwordFormat = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
    if (!str || str.trim().length < 1) {
      return { error: 'Password cannnot be empty' };
    }

    if (str.trim().length < 8) {
      return { error: 'Password must not be less than 8 characters' };
    }

    if (!str.trim().match(passwordFormat)) {
      return { error: 'password must be alphanumeric' };
    }

    return {};
  }
}
