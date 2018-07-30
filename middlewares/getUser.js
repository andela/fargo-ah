import db from '../models';

const { User } = db;
const getUser = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user || user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          errors: {
            body: ['The user does not exist']
          },
        });
      }
      req.userObject = user;
      next();
      return null;
    })
    .catch(next);
};

export default getUser;
