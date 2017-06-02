const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
  res.render('whiskies', { title: 'index.pug', reviews });
};

exports.getReviewBySlug = async (req, res, next) => {
  const review = await Review.findOne({ slug: req.params.slug });
  if (!review) return next();

  res.render('whisky', {
    review,
    title: review.name
  });
};

exports.showAddPage = (req, res) => {
  res.render('add', {
    title: 'add.pug'
  });
};

exports.createReview = async (req, res) => {
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
  }).exec(); // Make sure it runs incase of bugs

  res.json({ success: 'it worked', review });
};