import { Router } from 'express';
import bcrypt from 'bcrypt';
import checkEmail from '../../helpers/checkEmail';
import UserController from '../../controllers/UsersController';
import { User } from '../../models';
import verifyToken from '../../middlewares/verifyToken';

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

router.post('/users', UserController.registerUser);

router.post('/users/login', UserController.login);

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
router.post('/users/password/reset', checkEmail, UserController.sendEmail);
router.put('/users/password/reset/edit', verifyToken, UserController.resetPassword);
export default router;
