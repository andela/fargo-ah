import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import mailer from 'nodemailer';
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

  /** @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} success or failure response
  */
  static sendEmail(req, res) {
    // return res.send(req.body.token);
    const mailOptions = {
      from: 'sinmi.mtracker@gmail.com',
      to: req.body.user.email,
      subject: 'Password reset Authors-Haven.com',
      html: `<p>Hello ${req.body.user.username},</p><p> You can reset your password by clicking this <a href='${req.protocol}://${req.headers.host}/api/users/password/reset/edit?token=${req.body.token}'>link</a></p>
      <p style="text-align: center;"> Author's Haven support team</p>`
    };
    const transport = mailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.emailAdd,
        pass: process.env.emailPassword,
      },
      transportMethod: 'SMTP',
      tls: {
        rejectUnauthorized: false
      }
    });
    transport.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ message: 'Email failed to send', error });
      }
      res.status(200).json({ message: 'Email sent successfully' });
    });
  }

  /**
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} success or failure response
  */
  static resetPassword(req, res) {
    bcrypt.hash(req.body.user.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ err });
      }
      User.update({ hashedPassword: hash }, { where: { id: parseInt(req.userId, 10) } })
        .then(() => {
          res.status(200).json({
            success: true,
            message: 'Password reset successful!'
          });
        })
        .catch(() => res.status(500).json({ err }));
    });
  }
}
