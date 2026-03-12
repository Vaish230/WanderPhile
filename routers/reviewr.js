const express = require("express");
const review = require("../models/reviews.js");
const router = express.Router((mergeParams = true));
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");

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
  validateReview,
  wrapAsync(async (req, res) => {
    const listingData = await listing.findById(req.params.id);

    const newReview = new review(req.body.review);

    listingData.reviews.push(newReview._id);

    await newReview.save();
    await listingData.save();

    res.redirect(`/listings/${req.params.id}`);
  }),
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
