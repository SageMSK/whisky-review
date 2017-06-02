const express = require('express');
const router = express.Router();

const reviewController = require('./../controllers/reviewController');
const { catchAsyncErrors } = require('./../services/errorHandlers');

router.get('/', catchAsyncErrors(reviewController.getReviews));

router.post('/add', catchAsyncErrors(reviewController.createReview));

router.post('/add/:id', catchAsyncErrors(reviewController.updateReview));

router.get('/whiskies', catchAsyncErrors(reviewController.getReviews));
router.get('/whisky/:slug', catchAsyncErrors(reviewController.getReviewBySlug));

module.exports = router;