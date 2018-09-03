import { User } from '../models';

exports.checkIfUserIsVerified = async (req, res, next) => {
  const { email } = req.body.user;
  const usertoBeVerified = await User.find({ where: { email } });
  if (usertoBeVerified && usertoBeVerified.isverified === false) {
    return res.status(400).json({
      success: false,
      errors: {
        body: ['Your account has not been activated'],
      }
    });
  }
  next();
};
