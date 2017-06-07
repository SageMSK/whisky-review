const mongoose = require('mongoose');
const validator = require('validator');
const mongoosedbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email.'],
    required: 'Please provide an email.'
  },
  firstName: {
    type: String,
    trim: true,
    required: 'Please provide your first name.'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'Please provide your last name.'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/*
  Virtual Field for Gravatar
*/
userSchema.virtual('gravatar').get(function () {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongoosedbErrorHandler);

module.exports = mongoose.model('User', userSchema);