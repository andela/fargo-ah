import { Router } from 'express';
import passport from 'passport';
import AuthController from '../../controllers/authController';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/redirect',
  passport.authenticate('google'), AuthController.strategyCallback, AuthController.jsonResponse
);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', { session: false }),
  AuthController.strategyCallback, AuthController.jsonResponse
);


router.post('/auth/response', (req, res, next) => {
  req.user = req.body;
  next();
}, AuthController.jsonResponse);

export default router;
