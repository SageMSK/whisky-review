const mongoose = require('mongoose');
const slug = require('slugs');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please provide the name of the drink.'
  },
  slug: String,
  abv: {
    type: Number,
    required: 'Please provide the Alcohol by Volume.'
  },
  amount: {
    type: Number,
    required: 'Please provide the bottle amount in milliliters.'
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: 'Please provide a rating.'
  },
  photo: String,
  description: {
    type: String,
    trim: true
  },
  nose: {
    type: String,
    trim: true,
    required: 'Please provide the aroma.'
  },
  palate: {
    type: String,
    trim: true,
    required: 'Please provide the palate.'
  },
  finish: {
    type: String,
    trim: true,
    required: 'Please provide the finish.'
  },
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You need an author.'
  }
}, { // Shows virtual fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/*
  Slugs are for link names. Must be a unique link
*/
reviewSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slug(this.name);

  // If duplicates
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const reviewsWithSlugs = await this.constructor.find({ slug: slugRegEx });

  if (reviewsWithSlugs.length) {
    this.slug = `${this.slug}-${reviewsWithSlugs.length + 1}`
  }

  next();
});

/*
  Virtual Field for comments
  i.e. review.comments
*/
// Find comments where the store's _id property === comments store id property
reviewSchema.virtual('comments', {
  ref: 'Comment', // Which model to link?
  localField: '_id', // which field on the review (current)?
  foreignField: 'review' // which field on the comment (The comment model)?
});

function autopopulateComments(next) {
  this.populate('comments');
  next();
}

reviewSchema.pre('find', autopopulateComments);
reviewSchema.pre('findOne', autopopulateComments);

module.exports = mongoose.model('Review', reviewSchema);