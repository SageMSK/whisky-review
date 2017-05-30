const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const errorHandlers = require('./services/errorHandlers');

/* --- MIDDLEWARES --- */
// Setting up our view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Make req.body usable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// I.e. req.flash('error', 'Please try again.'), which will then pass that message to the next page the user requests
app.use(flash());

app.get('/', (req, res) => {
  res.render('index', { title: 'Hello World'});
});

/* --- ERROR --- */
app.use(errorHandlers.notFound);
// app.ues(errorHandlers.flashValidationErrors);
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

module.exports = app;