import passport from 'passport';
import local from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import AuthController from '../controllers/authController';
import { User } from '../models';

const LocalStrategy = local.Strategy;

const passportConfig = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    ((email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { 'email or password': 'is invalid' }
            });
          }

          return done(null, user);
        })
        .catch(done);
    })
  ));

  /**
 * configurations for passport strategies
 */

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/login/google/redirect',
  }, AuthController.strategyCallback));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.envFACEBOOK_REDIRECT_URL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
  }, AuthController.strategyCallback));
};

export default passportConfig;
