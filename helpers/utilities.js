import { } from 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import mailer from 'nodemailer';
// import stubTransport from 'nodemailer-stub-transport';
import { User } from '../models';
import { sendMailReset } from './sendEmail';

/**
 *  Class representing all utility functions
 *
 */
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
          firstname: userObject.firstname,
          lastname: userObject.lastname
        },
      };
    } else {
      output = {
        success: true,
        message: `You've successfully registered! A verification email has been sent to you,
       please click the verification link to continue`,
        user: {
          email: userObject.email,
          token,
          username: userObject.username,
          bio: userObject.bio,
          image: userObject.image,
          firstname: userObject.firstname,
          lastname: userObject.lastname
        },
      };
    }
    return output;
  }

  // /**
  // * @callback next
  // * @param {Object} req - Request object
  // * @param {Object} res - Response object
  // * @param {next} next - next route handler
  // * @returns {Object} success or failure response
  // */
  // static sendEmail(req, res, next) {
  //   let transport;
  //   const mailOptions = {
  //     from: process.env.fromEmailAdd,
  //     to: req.body.user.email,
  //     subject: 'Password reset Authors-Haven.com',
  //     html: `<h3 style="color: blue;">Author's Haven</h3><p>Hello ${req.body.user.username},</p><p> You can reset your password by clicking this <a href='${process.env.FRONT_END_RESET}/password/reset/edit?token=${req.body.token}'>link</a>. You received this email because you requested for password reset</p>
  //     <div style="text-align: center; background: aliceblue;"> <h5 style="padding: 10px;color: blue">Author's Haven &copy;2018</h5></div>`
  //   };
  //   if (process.env.NODE_ENV === 'TEST' || process.env.NODE_ENV === 'test') {
  //     transport = mailer.createTransport(stubTransport());
  //   } else {
  //     transport = mailer.createTransport({
  //       host: 'smtp.gmail.com',
  //       secure: true,
  //       port: 465,
  //       auth: {
  //         user: process.env.emailAdd,
  //         pass: process.env.emailPassword,
  //       },
  //       transportMethod: 'SMTP',
  //       tls: {
  //         rejectUnauthorized: false
  //       }
  //     });
  //   }
  //   transport.sendMail(mailOptions, (error) => {
  //     if (error) {
  //       return next(error.message);
  //     }
  //     res.status(200).json({ message: 'Email sent successfully' });
  //   });
  // }

  /* eslint-disable */
  static sendmail(req, res, next) {
    console.log('got here sendemail', req.body.user.email);
    if(req.body.user.email) {
      sendMailReset([req.body.user.email], req.body.user.username, req.body.token);
      res.status(200).json({ message: 'Email sent successfully' });
    }
    
  }

  /**
  * @callback next
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {next} next - next route handler
  * @returns {Object} success or failure response
  */
  static resetPassword(req, res, next) {
    bcrypt.hash(req.body.user.password, 10, (err, hash) => {
      User.update({ hashedPassword: hash }, { where: { id: parseInt(req.userId, 10) } })
        .then(() => {
          res.status(200).json({
            success: true,
            message: 'Password reset successful!'
          });
        })
        .catch(next);
    });
  }

  /**
  * @callback next
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {next} next - next route handler
  * @returns {Object} success or failure response
  */
  static checkEmail(req, res, next) {
    User.find({
      where: {
        email: req.body.user.email
      }
    })
      .then((user) => {
        if (!user) return res.status(404).json({ errors: { body: ['email does not exist'] } });
        req.body.user.username = user.username;
        const { id } = user;
        req.body.token = jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, { expiresIn: '40m' });
        return next();
      })
      .catch(next);
  }

  /**
  * @function increaseCount
  * @summary: A funtion to increase count
  * each time an article is updated
  * @param {Integer} count: input param
  * @returns {Integer} number of count: for updating articles
  */
  static increaseCount(count) {
    if (Number.isInteger(count)) return count + 1;
  }
}
