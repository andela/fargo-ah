import passport from 'passport';
import bcrypt from 'bcrypt';
import local from 'passport-local';
import db from '../models';

const LocalStrategy = local.Strategy;

passport.use(new LocalStrategy(
  {
    usernameField: 'user[email]',
    passwordField: 'user[password]'
  },
  ((email, password, done) => {
    db.User.findOne({ where: { email } })
      .then((user) => {
        bcrypt.compare(
          password,
          user.hashedPassword,
          (err, res) => {
            if (!user || !res || err) {
              return done(null, false, {
                errors: { 'email or password': 'is invalid' }
              });
            }
            return done(null, user);
          }
        );
      })
      .catch(done);
  })
));
