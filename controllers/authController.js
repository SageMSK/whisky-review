const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Your email or password did not match.',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
};

exports.requireUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Logged in
  }
  // If not
  req.flash('error', 'You must be logged in.');
  res.redirect('/login');
};