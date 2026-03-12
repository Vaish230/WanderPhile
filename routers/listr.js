const express = require("express");
const router = express.Router((mergeParams = true));
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const sessions = require("express-session");
const flash = require("connect-flash");

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

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allList = await listing.find({});
    res.render("listings/home.ejs", { allList });
  }),
);

router.get(
  "/add",
  wrapAsync(async (req, res) => {
    res.render("listings/add.ejs");
  }),
);

router.post(
  "/add",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { title, description, price, location, country } = req.body.listing;
    let newList = new listing({
      title,
      description,
      price,
      location,
      country,
    });
    await newList.save();
    req.flash("success", "Successfully added a new listing!");
    res.redirect("/listings");
  }),
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const allList = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { allList });
  }),
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const allList = await listing.findById(id);
    res.render("listings/edit.ejs", { allList });
  }),
);

router.patch(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    await listing.findByIdAndUpdate(
      id,
      { title, description, price, location, country },
      { runValidators: true },
    );
    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
