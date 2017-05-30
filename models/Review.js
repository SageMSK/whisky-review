const mongoose = require('mongoose');
const slug = require('slugs');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please provide the name of the drink.'
  },
  slug: String,
  rating: {
    type: Number,
    required: 'Please provide a rating.'
  },
  photo: String,
  description: {
    type: String,
    trim: true
  },
  nose: {
    type: String,
    trim: true
  },
  taste: {
    type: String,
    trim: true
  },
  finish: {
    type: String,
    trim: true
  }
});

/*
  Slugs are for link names. Must be a unique link
*/
reviewSchema.pre('save' async function (next) {
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

module.exports = mongoose.model('Review', reviewSchema);