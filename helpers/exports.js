import winston from 'winston';
import { User } from '../models';
import sendVerificationEmail from './sendEmail';

exports.checkIfUserIsVerified = async (req, res, next) => {
  const { email } = req.body.user;
  try {
    const usertoBeVerified = await User.find({
      where: { email }
    });
    if (usertoBeVerified) {
      if (usertoBeVerified.isverified === false) {
        return res.status(400).json({
          success: false,
          errors: {
            body: ['You account has not been activated'],
          }
        });
      }
    }
    next();
  } catch (err) {
    // probable error: Cannot read property "isunverified"for an email address that doesn't exist
    // This should be passed to the login
    next();
  }
};

exports.recover = async (req, res, next) => {
  const { email } = req.body.user;
  try {
    const usertoBeVerified = await User.findOne({
      where: { email }
    });
    if (usertoBeVerified === null || usertoBeVerified === 'null' || usertoBeVerified.isverified === true) {
      return res.status(400).json({
        errors: {
          body: ['A verification email will be sent to you if your account is not yet verified']
        }
      });
    }
    await sendVerificationEmail(req, res, usertoBeVerified.email, usertoBeVerified.id);
    res.status(200).json({
      message: {
        body: ['A verification email will be sent to you if your account is not yet verified']
      }
    });
  } catch (err) {
  // probable error: Cannot read property "isunverified" for an email address that doesn't exist
  // This should be passed to the login
    winston.info(err);
  }
};
