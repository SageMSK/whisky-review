const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mail = require('./../services/mail');

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

exports.getResetPasswordPage = (req, res) => {
  res.render('passwordreset', {
    title: 'Reset Your Password'
  });
};

exports.sendResetMail = async (req, res) => {
  // See if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error','No account with that email exists.');
    return res.redirect('/login');
  }

  // Set reset tokens and expired date on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now (in ms)
  await user.save();

  // Send email with token
  let resetURL = `http://${req.headers.host}/user/reset/${user.resetPasswordToken}`;
  
  // TODO - Setup mail service
  await mail.sendPasswordResetEmail({
    user,
    filename: 'email-password-reset',
    subject: 'Password Reset',
    resetURL
  });

  // Redirect to login page
  req.flash('success', `Email Sent!`)
  res.redirect('/login');
};

exports.getPasswordPage = async (req, res) => {
  // Find User with user token
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired.');
    return res.direct('/login');
  }

  res.render('reset', { 
    title: "Reset Your Password"
  });
};

exports.confirmNewPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    return next();
  }

  req.flash('error', 'Passwords do not match.');
  res.redirect('back');
};

exports.updateNewPassword = async (req, res) => {
  // Find User with token
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired.');
    return res.direct('/login');
  }

  // Callback func must be promisify
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);

  // In MongoDB, to remove fields set them to undefined
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  // Update our new user's password
  const updatedUser = await user.save();

  // automatically log them in
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset.');
  res.redirect('/');
};