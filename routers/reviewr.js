const express = require("express");
const review = require("../models/reviews.js");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isReviewOwner } = require("../middlewares.js");
const controllingr = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log("JOI ERROR:", error.details[0].message);
    throw new ExpressError(error.details[0].message, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(controllingr.postReview),
);

router.delete(
  "/:reviewId",
  isLoggedIn,

  isReviewOwner,
  wrapAsync(controllingr.deleteReview),
);

module.exports = router;
