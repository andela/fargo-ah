const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./../models');

passport.use(new LocalStrategy(
  {
    usernameField: 'user[email]',
    passwordField: 'user[password]'
  },
  function (email, password, done) {
    User.findOne({ where: { email }})
      .then(function (user) {
        bcrypt.compare(password, user.hashedPassword, function (err, res) {
          if (!user || !res || err) {
            return done(null, false, {
              errors: { 'email or password': 'is invalid' }
            });
          }
          return done(null, user);
        });
      })
      .catch(done);
  }
));
