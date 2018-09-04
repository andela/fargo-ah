import { Router } from 'express';
import utils from '../../helpers/utilities';
import validateSignup from '../../middlewares/validateSignup';
import validateLogin from '../../middlewares/validateLogin';
import UsersController from '../../controllers/UsersController';
import validateProfile from '../../middlewares/validateProfile';
import validateToken from '../../middlewares/verifyToken';
import validator from '../../middlewares/ParamsValidator';
import inputValidator from '../../middlewares/inputValidator';
import { resendVerificationEmail } from '../../helpers/exports';
import { checkIfUserIsVerified } from '../../middlewares/checkIfUserIsVerified';
import getUser from '../../middlewares/getUser';

const router = Router();

router.get('/users/verify/:token', UsersController.verifyEmail);

router.post('/users', validateSignup, UsersController.registerUser);

router.post('/users/reverify', inputValidator.validateEmail, resendVerificationEmail);

router.post('/users/login', validateLogin, checkIfUserIsVerified, UsersController.login);

router.get(
  '/profiles/:username',
  validator.validateUsername,
  UsersController.getProfile
);

router.put(
  '/profiles/:username',
  validateToken,
  validator.validateId,
  validator.validateUsername,
  validateProfile,
  UsersController.editProfile
);

router.post('/users', validateSignup, UsersController.registerUser);

router.post('/users/password/reset', inputValidator.validateEmail, utils.checkEmail, utils.sendEmail);

router.put('/users/password/reset/edit', inputValidator.validatePassword, validateToken, utils.resetPassword);

router.post(
  '/profiles/:username/follow',
  validateToken,
  validator.validateUsername,
  getUser, UsersController.follow
);

router.get(
  '/profiles/following/view',
  validateToken, UsersController.getAllAmFollowing
);

router.get(
  '/profiles/follower/view',
  validateToken, UsersController.getAllMyFollowers
);

router.delete(
  '/profiles/:username/follow',
  validateToken,
  validator.validateUsername,
  getUser, UsersController.unfollow
);

export default router;
