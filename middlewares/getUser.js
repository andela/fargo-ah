import db from '../models';

const getUser = (req, res, next) => {
  db.User.findById(req.userId)
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
    })
    .catch(err => res.status(500).json({
      success: false,
      errors: {
        body: [err]
      },
    }));
};

export default getUser;
