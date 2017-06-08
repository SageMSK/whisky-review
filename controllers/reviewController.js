const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.getHomePage = (req, res) => {
  res.render('homepage', { title: 'Home' });
};

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
  res.render('whiskies', { title: 'Whiskies', reviews });
};

exports.getReviewBySlug = async (req, res, next) => {
  const review = await Review.findOne({ slug: req.params.slug }).populate('author');
  if (!review) return next();

  res.render('whisky', {
    review,
    title: review.name
  });
};

exports.getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About'
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