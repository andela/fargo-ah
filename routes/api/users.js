import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';

import { User } from '../../models';

const router = Router();

router.get('/user/', (req, res, next) => {
  User.findById(req.payload.id)
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

  User.update({
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

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }
  passport.authenticate('local',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.json({ user: user.toAuthJSON() });
      }
      return res.status(422).json(info);
    })(req, res, next);
});

router.post('/users', (req, res, next) => {
  const newUser = {};
  newUser.username = req.body.user.username;
  newUser.email = req.body.user.email;
  newUser.password = req.body.user.password;
  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    User.create({
      username: newUser.username,
      hashedPassword: hash,
      email: newUser.email,
    }).then(registeredUser => res.json({
      user: registeredUser.toAuthJSON(),
    })).catch(next);
  });
});

export default router;
