import { User } from '../models';
import sendVerificationEmail from './sendmail';

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body.user;
  try {
    const usertoBeVerified = await User.findOne({
      where: { email }
    });

    if (usertoBeVerified === null || usertoBeVerified === 'null') {
      return res.status(400).json({
        status: false,
        errors: {
          body: ['You have entered an unregistered email address']
        }
      });
    }
    if (usertoBeVerified && usertoBeVerified.isverified === true) {
      return res.status(400).json({
        status: false,
        errors: {
          body: ['Your account has already been verified']
        }
      });
    }

    sendVerificationEmail.sendEmail(usertoBeVerified);
    res.status(200).json({
      status: true,
      message: {
        body: ['A verification email has been sent to you']
      }
    });
  } catch (err) {

  // probable error: Cannot read property "isunverified" for an email address that doesn't exist

  }
};
