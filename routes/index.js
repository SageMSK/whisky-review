const express = require('express');
const router = express.Router();

const reviewController = require('./../controllers/reviewController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const { catchAsyncErrors } = require('./../services/errorHandlers');

/*
  GET Methods for fetching pages
*/
router.get('/', catchAsyncErrors(reviewController.getReviews));
router.get('/whiskies', catchAsyncErrors(reviewController.getReviews));
router.get('/whisky/:slug', catchAsyncErrors(reviewController.getReviewBySlug));
router.get('/add', authController.requireUser, reviewController.showAddPage);
router.get('/about', reviewController.getAboutPage);
router.get('/whisky/:id/edit', catchAsyncErrors(reviewController.showEditPage));
router.get('/login', userController.loginPage);
router.get('/register', userController.registrationPage);
router.get('/logout', authController.logout);
router.get('/user', authController.requireUser, userController.getUserPage);

/*
  POST Methods
*/
router.post('/add', catchAsyncErrors(reviewController.createReview));
router.post('/add/:id', catchAsyncErrors(reviewController.updateReview));
router.post('/register', 
  catchAsyncErrors(userController.createUser),
  userController.validateRegister,
  authController.login
);
router.post('/login', authController.login);
router.post('/user', 
  authController.requireUser, 
  catchAsyncErrors(userController.updateUserInfo)
);

module.exports = router;