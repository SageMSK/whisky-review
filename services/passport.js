const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');

// Available from package - "passport-local-mongoose"
passport.use(User.createStrategy());

/*
  We want the user object.
  Everytime there is a request, this will ask passport what should I do
  with the actual user now that the user is logged in.
*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
