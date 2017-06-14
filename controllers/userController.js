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
  req.sanitizeBody('username');
  req.checkBody('username', 'You must enter an available username.').notEmpty();
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
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  // Check is user/email is already in use or exists.
  const findUserFirstByEmail = User.findOne({ email });
  const findUserFirstByUsername = User.findOne({ username });

  const [ userMail, userUsername ] = await Promise.all([ findUserFirstByEmail, findUserFirstByUsername ])

  // check if user exists by email
  if (userMail) {
    // check if email exists
    if (userMail.email === email) {
      console.log('ERROR: Found an email in use already.');
      console.log(`userMail's email: ${userMail.email}`);
      req.flash('error', 'Email already in use.');
      res.redirect('/register');
      return;
    }
  }

  // check if user exists by username
  if (userUsername) {
    // check if username exists
    if (userUsername.username === username) {
      console.log('ERROR: Found the username in use already.');
      console.log(`userUsername's username: ${userUsername.username}`);
      req.flash('error', 'Username already taken.');
      res.redirect('/register');
      return;
    }
  }

  const newUser = new User({ email, username, firstName, lastName });
  // Not save but register because passportlocalMongoose gives us a method: register
  // Problem: register doesn't return a promise.
  const register = promisify(User.register, User); 
  await register(newUser, req.body.password); // stores a hashed password

  next();
};

exports.getAccountPage = async (req, res) => {
  // const username = req.params.username;
  // const user = await User.findOne({ username });

  res.render('account', { 
    title: 'Profile',
  });
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

