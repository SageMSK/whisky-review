const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const errorHandlers = require('./services/errorHandlers');
const pugHelpers = require('./services/pugHelpers');
const routes = require('./routes/index');

/* --- MIDDLEWARES --- */
// Setting up our view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serves up static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Make req.body usable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// I.e. req.flash('error', 'Please try again.'), which will then pass that message to the next page the user requests
// app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = pugHelpers;
  // res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path; // For routing on pug template
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