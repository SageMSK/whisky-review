const express = require('express');
const router = express.Router();

const reviewController = require('./../controllers/reviewController');
const { catchAsyncErrors } = require('./../services/errorHandlers');

/*
  GET Methods for fetching pages
*/
router.get('/', catchAsyncErrors(reviewController.getReviews));
router.get('/whiskies', catchAsyncErrors(reviewController.getReviews));
router.get('/whisky/:slug', catchAsyncErrors(reviewController.getReviewBySlug));
router.get('/add', reviewController.showAddPage);
router.get('/whisky/:id/edit', catchAsyncErrors(reviewController.showEditPage));

/*
  POST Methods
*/
router.post('/add', catchAsyncErrors(reviewController.createReview));
router.post('/add/:id', catchAsyncErrors(reviewController.updateReview));


module.exports = router;