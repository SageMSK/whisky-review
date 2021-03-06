const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const promisify = require('es6-promisify');
const favicon = require('serve-favicon');

const app = express();
const errorHandlers = require('./services/errorHandlers');
const pugHelpers = require('./services/pugHelpers');
const routes = require('./routes/index');
require('./services/passport');

/* --- MIDDLEWARES --- */
// Setting up our view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serves up static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Make req.body usable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Need various methods for validation during user registration
app.use(expressValidator());

app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// I.e. req.flash('error', 'Please try again.'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = pugHelpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path; // For routing on pug template
  next();
});

// promisify some callback based APIs
// NEEDED in authController.updateNewPassword
// Need for auto re-login
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// Routes
app.use('/', routes);

/* --- ERROR --- */
app.use(errorHandlers.notFound);
// app.ues(errorHandlers.flashValidationErrors);
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

module.exports = app;