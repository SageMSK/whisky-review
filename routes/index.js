const express = require('express');
const router = express.Router();

const reviewController = require('./../controllers/reviewController');
const { catchAsyncErrors } = require('./../services/errorHandlers');

router.get('/', catchAsyncErrors(reviewController.getReviews));

router.post('/add', catchAsyncErrors(reviewController.createReview));

router.post('/add/:id', catchAsyncErrors(reviewController.updateReview));

module.exports = router;