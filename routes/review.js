const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {isLoggedin,  validatereview , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Revew Route
router.post("/",validatereview,isLoggedin, wrapAsync(reviewController.createreview));

//Delete Review
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.deletereview));

module.exports = router;
