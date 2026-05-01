const listing = require("./models/listing.js");
const review = require("./models/reviews.js");

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  const foundListing = await listing.findById(id);

  if (!foundListing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  if (!foundListing.owner || !foundListing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const foundreview = await review.findById(reviewId);
  if (!foundreview || !foundreview.author.equals(req.user.id)) {
    req.flash("error", "You are not the owner of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
