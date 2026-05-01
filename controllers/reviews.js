const listing = require("../models/listing.js");
const review = require("../models/reviews.js");

module.exports.postReview = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }

  const listingData = await listing.findById(req.params.id);

  const newReview = new review(req.body.review);
  console.log("USER:", req.user);
  newReview.author = req.user._id;

  await newReview.save();

  listingData.reviews.push(newReview._id);
  await listingData.save();

  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  const { id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
