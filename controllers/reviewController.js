const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const review = new Review(req.body);
  const savedReview = await review.save();

  res.json({ success: 'it worked', savedReview });
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