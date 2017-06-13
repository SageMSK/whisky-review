const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Must have an author.'
  },
  message: {
    type: String,
    required: 'Must have text.'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    required: 'Must have a store connected.'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/*
  Need to populate them automatically when called to have access to the object info
*/
function autopopulateAuthor(next) {
  // Mongoose method to populate ObjectId
  this.populate('author');
  next();
}

// When find/findOne is called, it will autopopulate so we don't
// have to call populate() on each controller method.
commentSchema.pre('find', autopopulateAuthor);
commentSchema.pre('findOne', autopopulateAuthor)

module.exports = mongoose.model('Comment', commentSchema);