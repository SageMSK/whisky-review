const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

// Handling Images (multipart/form-data)
const multerOptions = {
  // where the files are stored
  storage: multer.memoryStorage(),
  // What type of files are allowed to upload
  fileFilter (req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      // @params (error, correct value)
      next(null, true);
    } else {
      next({ message: "That filetype is not allowed." } , false);
    }
  }
};

exports.getHomePage = (req, res) => {
  res.render('homepage', { title: 'Home' });
};

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
  res.render('whiskies', { title: 'Whiskies', reviews });
};

exports.getReviewBySlug = async (req, res, next) => {
  // populate the author's object to show user's info
  // populate comments for adding comment virtual model in the review's schema/model
  const review = await Review.findOne({ slug: req.params.slug }).populate('author comments');
  if (!review) return next();

  res.render('whisky', {
    review,
    title: review.name
  });
};

exports.getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About WhiskyPark'
  })
};

exports.showAddPage = (req, res) => {
  res.render('add', {
    title: 'New Whisky Review'
  });
};

exports.showEditPage = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });

  res.render('add', {
    title: `Editing: ${review.name}`,
    review
  });
};

/*
  Image
*/
// doesn't save the file to dist folder, just the memory of the server temporary
exports.uploadImage = multer(multerOptions).single('photo');

exports.resizeImage = async (req, res, next) => {
  // check if there are no new file to size
  if (!req.file) {
    return next();
  }

  // Assign the photo model with a unique id
  const extensions = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extensions}`;

  // Resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(500, jimp.AUTO); // 500 height | auto-width
  await photo.write(`./public/uploads/${req.body.photo}`); // Save the image in file

  next(); // finished
};

exports.createReview = async (req, res) => {
  // Set the author to the current user for reference.
  req.body.author = req.user._id;

  const review = new Review(req.body);
  const savedReview = await review.save();

  req.flash('success', `Your review for ${savedReview.name} has been created.`)
  res.redirect(`/whisky/${savedReview.slug}`)
};

exports.updateReview = async (req, res) => {
  const review = await Review.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true, // return the new review instead of the old one
    runValidators: true
  }).exec(); // Make sure it runs because sometimes it doesn't

  req.flash('success', `Your changes for ${review.name} have been saved.`);
  res.redirect(`/whisky/${review.slug}`);
};

exports.deleteReviewPage = async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.id
  });

  res.render('delete', {
    title: `Deleting: ${review.name}`,
    review
  });
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.id
  });
  // check if review exists
  if (!review) {
    req.flash('error', "This whisky review does not exist.");
    return res.redirect('back');
  }

  if (review.slug !== req.body.slug) {
    req.flash('error', "Review name does not match.");
    return res.redirect('back');
  }

  await review.remove();

  req.flash('success', "Your whisky review has been deleted.");
  res.redirect('/whiskies');
};