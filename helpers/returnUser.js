import db from '../models';

const returnUser = (id) => {
  db.User.findById(id)
    .then(user => ({
      username: user.username,
      email: user.email,
    }))
    .catch(err => err);
};

export default returnUser;
