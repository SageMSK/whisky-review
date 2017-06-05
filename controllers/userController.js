const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginPage = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};

exports.registrationPage = (req, res) => {
  res.render('register', {
    title: 'Register'
  });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('firstName');
  req.checkBody('firstName', 'You must enter your first name.').notEmpty();
  req.sanitizeBody('lastName');
  req.checkBody('lastName', 'You must enter your last name.').notEmpty();

  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('email', 'That Email is not valid').notEmpty().isEmail();

  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('password-confirm', 'Please enter your password again.').notEmpty();
  req.checkBody('password-confirm', 'Your passwords do not match.').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(error => error.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.createUser = async (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  // Check is user/email is already in use or exists.
  const findUserFirst = await User.findOne({ email });
  if (findUserFirst) {
    req.flash('error', 'Email already in use.');
    res.redirect('/register');
    return;
  }

  const newUser = new User({ email, firstName, lastName });
  // Not save but register because passportlocalMongoose gives us a method: register
  // Problem: register doesn't return a promise.
  const register = promisify(User.register, User); 
  await register(newUser, req.body.password); // stores a hashed password

  next();
};

exports.getUserPage = (req, res) => {
  res.render('account', { title: 'Edit Your account' });
};

exports.updateUserInfo = async (req, res) => {
  const updatedUserInfo = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  const currentUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updatedUserInfo },
    { new: true, runValidators: true, context: 'query' }
  );

  req.flash('success', 'Your profile information has been updated.');
  res.redirect('/user');
};