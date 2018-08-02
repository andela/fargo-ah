import db from '../models';

const { User } = db;
const getUser = (req, res, next) => {
  let whereField = {};
  if (req.params.username) {
    whereField = { username: req.params.username };
  } else {
    whereField = { id: req.userId };
  }
  db.User.find({ where: whereField })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: {
            body: ['The user does not exist']
          }
        });
      }
      req.userObject = user;
      next();
      return null;
    })
    .catch(next);
};

export default getUser;
