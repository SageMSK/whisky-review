const express = require('express');
const router = express.Router();

const reviewController = require('./../controllers/reviewController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');
const { catchAsyncErrors } = require('./../services/errorHandlers');

/* =====================
  GET Methods for fetching pages
  ===================== */
router.get('/', catchAsyncErrors(reviewController.getReviews));
router.get('/whiskies', catchAsyncErrors(reviewController.getReviews));
router.get('/whisky/:slug', catchAsyncErrors(reviewController.getReviewBySlug));
router.get('/add', authController.requireUser, reviewController.showAddPage);
router.get('/about', reviewController.getAboutPage);
router.get('/whisky/:id/edit', catchAsyncErrors(reviewController.showEditPage));
router.get('/login', userController.loginPage);
router.get('/register', userController.registrationPage);
router.get('/logout', authController.logout);
router.get('/user/:username', catchAsyncErrors(userController.getAccountPage));
router.get('/password_reset', authController.getResetPasswordPage);
router.get('/user/reset/:token', catchAsyncErrors(authController.getPasswordPage));
router.get('/whisky/:id/delete', catchAsyncErrors(reviewController.deleteReviewPage));


/* =====================
      POST Methods
  ===================== */
router.post('/add',
  reviewController.uploadImage,
  catchAsyncErrors(reviewController.resizeImage),
  catchAsyncErrors(reviewController.createReview)
);
router.post('/add/:id',
  reviewController.uploadImage,
  catchAsyncErrors(reviewController.resizeImage),
  catchAsyncErrors(reviewController.updateReview)
);
router.post('/register', 
  userController.validateRegister,
  catchAsyncErrors(userController.createUser),
  authController.login
);
router.post('/login', authController.login);
router.post('/user', 
  authController.requireUser, 
  catchAsyncErrors(authController.updateUserInfo)
);
router.post('/password_reset', catchAsyncErrors(authController.sendResetMail));
router.post('/user/reset/:token', 
  authController.confirmNewPasswords,
  catchAsyncErrors(authController.updateNewPassword)
);
// Really don't want to use POST. Will change to AJAX DELETE method
router.post('/whisky/:id/delete', catchAsyncErrors(reviewController.deleteReview));

// Favorite reviews: toggle
router.post('/whisky/:id/favorite', 
  authController.requireUser,
  catchAsyncErrors(reviewController.favoriteReview)
);

/*
  Comments
*/
router.post('/comments/:id',
  authController.requireUser,
  catchAsyncErrors(commentController.addComment)
);
// Delete comment...soon
// router.delete('/comments/:id',
//   authController.requireUser,
//   catchAsyncErrors(commentController.deleteComment)
// );

module.exports = router;