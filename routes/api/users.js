import { Router } from 'express';

import validateSignup from '../../middlewares/validateSignup';
import UsersController from '../../controllers/UsersController';
import validateProfile from '../../middlewares/validateProfile';
import validateToken from '../../middlewares/verifyToken';
import validator from '../../middlewares/ParamsValidator';
import { resendVerificationEmail } from '../../helpers/exports';
import { checkIfUserIsVerified } from '../../middlewares/checkIfUserIsVerified';
import db from '../../models';


const router = Router();

router.get('/users/verify/:token', UsersController.verifyEmail);
router.post('/users/reverify', resendVerificationEmail);
router.post('/users', validateSignup, UsersController.registerUser);
router.post('/users/login', checkIfUserIsVerified, UsersController.login);
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


router.get('/user/', (req, res, next) => {
  db.User.findById(1)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json(utils.userToJson(user));
    })
    .catch(next);
});

router.put('/user', (req, res, next) => {
  const user = {};
  if (typeof req.body.user.username !== 'undefined') {
    user.username = req.body.user.username;
  }
  if (typeof req.body.user.email !== 'undefined') {
    user.email = req.body.user.email;
  }
  if (typeof req.body.user.bio !== 'undefined') {
    user.bio = req.body.user.bio;
  }
  if (typeof req.body.user.image !== 'undefined') {
    user.image = req.body.user.image;
  }
  if (typeof req.body.user.password !== 'undefined') {
    user.password = req.body.user.password;
  }

  db.User.update({
    username: user.username,
    email: user.email,
    image: user.image,
    hashedPassword: user.password,
    bio: user.bio
  }, { where: { id: 1 } }).then((updatedUser) => {
    if (updatedUser[0] === 0) {
      return res.sendStatus(401);
    }
    res.sendStatus(200);
  }).catch(next);
});

export default router;
