import { Router } from 'express';

import validateSignup from '../../middlewares/validateSignup';
import UsersController from '../../controllers/UsersController';
import validateProfile from '../../middlewares/validateProfile';
import validateToken from '../../middlewares/verifyToken';
import validator from '../../middlewares/ParamsValidator';

const router = Router();

router.post('/users', validateSignup, UsersController.registerUser);
router.post('/users/login', UsersController.login);
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

export default router;
