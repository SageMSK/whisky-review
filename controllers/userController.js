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
  //
};

exports.createUser = async (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const newUser = new User({ email, firstName, lastName });
  console.log(newUser);
  // Not save but register because passportlocalMongoose gives us a method: register
  // Problem: register doesn't return a promise.
  const register = promisify(User.register, User); 
  await register(newUser, req.body.password); // stores a hashed password

  next();
};