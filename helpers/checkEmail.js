import jwt from 'jsonwebtoken';
import { User } from '../models/index';

const checkEmail = (req, res, next) => {
  User.find({
    where: {
      email: req.body.user.email
    }
  })
    .then((user) => {
      if (!user) return res.status(404).json({ message: 'not found' });
      req.body.user.username = user.username;
      const { id } = user;
      req.body.token = jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, { expiresIn: '40m' });
      return next();
    })
    .catch(() => res.status(500).json({ message: 'error' }));
};
export default checkEmail;
