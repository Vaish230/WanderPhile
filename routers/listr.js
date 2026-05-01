const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const sessions = require("express-session");
const flash = require("connect-flash");
const { isOwner } = require("../middlewares.js");
const controlling = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    console.log("JOI ERROR:", error.details[0].message);
    throw new ExpressError(error.details[0].message, 400);
  } else {
    next();
  }
};

router.get("/", wrapAsync(controlling.mainPage));

router.get("/add", wrapAsync(controlling.addListingPage));

router.get("/search", wrapAsync(controlling.searchListings));

router.get("/category/:category", wrapAsync(controlling.getCategory));

router.get("/:id/edit", wrapAsync(controlling.getIDtoEdit));

router.get("/:id", wrapAsync(controlling.getID));

router.post(
  "/add",
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(controlling.postListing),
);

router.patch(
  "/:id",
  upload.single("listing[image]"),
  isOwner,
  validateListing,
  wrapAsync(controlling.editListing),
);

router.delete("/:id", wrapAsync(controlling.deleteListing));

module.exports = router;
