import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import { Op } from 'sequelize';
import { User } from '../models';
import utils from '../helpers/utilities';
import sendVerificationEmail from '../helpers/sendEmail';

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
            isverified: false
          }).then((registeredUser) => {
            const token = utils.signToken({ id: registeredUser.id });
            // send verification email
            sendVerificationEmail(req, res, registeredUser.email, registeredUser.id);
            winston.info('The verification email has been sent');
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
      where: { email, isverified: true }
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

  /**
   * Verify the email sent to the newly registered user
   * @param {*} req - request object
   * @param {*} res - response object
   * @param {*} next - Next function
   * @returns {token} token - returns JWT token
   */
  static verifySentEmail(req, res, next) {
    const { token } = req.params;
    try {
      const decodedUserData = jwt.verify(token, process.env.SECRETE_KEY);
      User.update({ isverified: true },
        { where: { id: decodedUserData.id } });
      res.status(200).json({ message: 'The user has been verified' });
    } catch (err) {
      return res.status(400).json({
        errors: { body: ['Your verification link has expired or invalid'] }
      });
    }
  }
}
