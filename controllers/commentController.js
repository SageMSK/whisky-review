const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');

exports.addComment = async (req, res) => {
  req.body.author = req.user._id;
  req.body.review = req.params.id;
  const newComment = new Comment(req.body);
  await newComment.save();
  req.flash('success', 'Comment posted');
  res.redirect('back');
};

exports.deleteComment = async (req, res) => {
  console.log('Server received action.');
  // find the comment
  const comment = await Comment.findOne({ _id: req.params.id });
  if (!comment) {
    req.flash('error', 'Comment does not exists or has been deleted.');
    return res.redirect('back');
  }

  await comment.remove();

  req.flash('success', "Your comment has been deleted.");
  res.redirect('back');
};