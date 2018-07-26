import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from '../models';
import utils from '../helpers/utilities';

/** * Class representing users */
export default class UsersController {
  /**
  * Register a user and return a JWT token
  * @param {*} req - Request object
  * @param {*} res - Response object
  * @param {*} next - Next function
  * @returns {token} token - JWT token
  */
  static registerUser(req, res, next) {
    const { email, username, password } = req.body.user;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      User.find({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      }).then((user) => {
        if (!user) {
          User.create({
            email,
            username,
            hashedPassword: hash,
          }).then((registeredUser) => {
            const token = utils.signToken({ id: registeredUser.id });
            res.status(200).json(utils.userToJson(registeredUser, token));
          }).catch(next);
        } else {
          res.status(409).json({
            success: false,
            errors: {
              body: ['Username or email already exists'],
            }
          });
        }
      }).catch(next);
    });
  }

  /**
   * Checks if the user exists and returns a JWT token
   * @param {*} req - request object
   * @param {*} res - response object
   * @param {*} next - Next function
   * @returns {token} token - returns JWT token
   */
  static login(req, res, next) {
    const { email, password } = req.body.user;
    User.find({
      where: { email }
    }).then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.hashedPassword, (err, result) => {
          if (err) {
            return next(err);
          }
          if (result) {
            const token = utils.signToken({ id: foundUser.id });
            res.status(200).json(utils.userToJson(foundUser, token));
          } else {
            res.status(401).json({
              success: false,
              errors: {
                body: ['Authentication failed'],
              }
            });
          }
        });
      } else {
        res.status(401).json({
          success: false,
          errors: {
            body: ['Authentication failed'],
          }
        });
      }
    }).catch(next);
  }
}
