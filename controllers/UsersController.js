import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import db from '../models';
import utils from '../helpers/utilities';
import sendVerificationEmail from '../helpers/sendmail';

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
      db.User.find({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      }).then((user) => {
        if (!user) {
          db.User.create({
            email,
            username,
            hashedPassword: hash,
          }).then((registeredUser) => {
            const token = utils.signToken({ id: registeredUser.id });
            sendVerificationEmail.sendEmail(registeredUser);
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
    db.User.find({
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

  /**
  * @function editProfile
  * @summary Returns a user's details for their profile
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {*} next - Incase of errors
  * @returns {object} An object containing all the data related to the user
  */
  static getProfile(req, res, next) {
    db.User.findOne({ where: { username: req.params.username } })
      .then((user) => {
        if (!user || user.rowCount < 1) {
          return res.status(404).json({
            success: false,
            errors: {
              body: ['The user does not exist'],
            }
          });
        }
        return res.status(200).json(utils.userToJson(user));
      })
      .catch(next);
  }

  /**
  * @function editProfile
  * @summary Return a user's profile after updating it
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} An object containing all the data related to the user if update successful
  */
  static editProfile(req, res) {
    const { username, image, bio } = req.body.user;
    db.User.findOne({ where: { username: req.params.username } })
      .then((user) => {
        if (!user || user.rowCount === 0) {
          return res.status(404).json({
            success: false,
            errors: {
              body: ['The user does not exist']
            },
          });
        }
        if (req.userId === user.id) {
          db.User.update({
            username,
            image,
            bio,
          }, {
            returning: true,
            where: { id: user.id }
          })
            .then(([rows, [updatedUser]]) => {
              if (rows === 0) {
                return res.status(401).json({
                  success: false,
                  errors: {
                    body: ['An error occured when updating your profile'],
                  }
                });
              }
              return res.status(200).json(utils.userToJson(updatedUser));
            }).catch(err => res.status(404).json({
              errors: {
                body: [err]
              },
            }));
        }
      })
      .catch(err => res.status(404).json({
        success: false,
        errors: {
          body: [err]
        },
      }));
  }

  /**
   * Verify the email sent to the newly registered user
   * @param {*} req - request object
   * @param {*} res - response object
   * @param {*} next - Next function
   * @returns {token} token - returns JWT token
   */
  static async verifyEmail(req, res) {
    const { token } = req.params;
    try {
      const decodedUserData = jwt.verify(token, process.env.SECRETE_KEY);
      const userFound = await db.User.findOne({ where: { id: decodedUserData.id } });
      if (userFound) {
        if (userFound.isverified) {
          return res.status(400).json({
            success: false,
            errors: {
              body: ['You account has already been activated'],
            }
          });
        }
      }
      db.User.update(
        { isverified: true },
        { where: { id: decodedUserData.id } }
      );
      return res.status(200).json({ message: 'The user has been verified' });
    } catch (err) {
      return res.status(400).json({
        errors: { body: ['Your verification link has expired or invalid'] }
      });
    }
  }
}
