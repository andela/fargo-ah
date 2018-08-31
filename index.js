import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import errorhandler from 'errorhandler';
import methodOverride from 'method-override';
import morgan from 'morgan';
import debugLog from 'debug';
import expressValidator from 'express-validator';
import swaggerUI from 'swagger-ui-express';
import { } from 'dotenv/config';
import passportConfig from './config/passport';
import routes from './routes';
import swaggerDoc from './swaggerDoc.json';


const isProduction = process.env.NODE_ENV === 'production';

const debug = debugLog('index');
passport.serializeUser(((user, done) => {
  done(null, user);
}));
passport.deserializeUser(((user, done) => {
  done(null, user);
}));

// Create global app object
const app = express();
passportConfig(app);
const corOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corOptions));


// Normal express config defaults;
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static(path.join(__dirname, '/public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

app.use(expressValidator());

app.use(routes);

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('You are not where you intend to be, please input a valid path');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
    next();
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
  next();
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  debug(`Listening on port ${server.address().port}`);
});

export default app;
