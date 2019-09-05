import { User } from '../models';
import utilities from '../helpers/utilities';
/**
 * @class AuthController
 *
 * @export
 *
 */
export default class AuthController {
  /**
   * @description - json response function
   * @static
   *
   *
   * @param {object} req
   * @param {object} res
   *
   * @returns {json} json
   *
   * @memberof AuthController
   *
   */
  static jsonResponse(req, res) {
    const user = {
      email: req.user.email,
      token: utilities.signToken({ id: req.user.id }),
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      username: req.user.username,
      image: req.user.image,
    };

    return res.redirect(`${process.env.FRONTEND_HOST_URL}?username=${user.username}&&token=${user.token}`);
  }


  /**
   * @description - model query function
   * @static
   *
   *
   * @param {object} user
   * @param {function} done
   *
   * @returns {object} newOrFoundUser
   *
   * @memberof AuthController
   *
   */
  static queryModel(user, done) {
    User.findOrCreate({
      where: {
        email: user.email,
      },
      defaults: user,
    }).spread((newOrFoundUser, created) => {
      const {
        id, email, username, lastname, firstname, image,
      } = newOrFoundUser.dataValues;
      return done(null, {
        id,
        email,
        username,
        lastname,
        firstname,
        image,
        created,
      });
    });
  }


  /**
   * @description - strategy callback function
   * @static
   *
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile
   * @param {function} done
   *
   * @returns {json} json
   *
   * @memberof AuthController
   *
   */
  static strategyCallback(accessToken, refreshToken, profile, done) {
    const userProfile = {
      firstname: profile.name.familyName,
      lastname: profile.name.givenName,
      username: profile.id,
      email: profile.emails[0].value,
      image: profile.photos[0].value,
    };
    AuthController.queryModel(userProfile, done);
  }
}
