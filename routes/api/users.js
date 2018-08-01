import { Router } from 'express';
import UserController from '../../controllers/UsersController';

import validateSignup from '../../middleware/validateSignup';
import db from '../../models';

const router = Router();

require('../../config/passport');

router.get('/user/', (req, res, next) => {
  db.user.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json({ user: user.toAuthJSON() });
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

  db.user.update({
    username: user.username,
    email: user.email,
    image: user.image,
    hashedPassword: user.password,
    bio: user.bio
  }, { where: { id: req.payload.id } }).then((updatedUser) => {
    if (updatedUser[0] === 0) {
      return res.sendStatus(401);
    }
    res.sendStatus(200);
  }).catch(next);
});

router.post('/users', validateSignup, UserController.registerUser);

router.post('/users/login', UserController.login);

export default router;
