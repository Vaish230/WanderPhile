const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const listing = require("./models/listing.js");
const review = require("./models/reviews.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

const app = express();

let port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const rList = require("./routers/listr.js");
const rReview = require("./routers/reviewr.js");
const rUser = require("./routers/userr.js");

main()
  .then(() => console.log("MONGODB WORKING"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wander");
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", async (req, res) => {
  res.redirect("/listings");
});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    console.log("JOI ERROR:", error.details[0].message);
    throw new ExpressError(error.details[0].message, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log("JOI ERROR:", error.details[0].message);
    throw new ExpressError(error.details[0].message, 400);
  } else {
    next();
  }
};

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allList = await listing.find({});

    res.render("listings/home.ejs", { allList });
  }),
);

app.get(
  "/listings/add",
  wrapAsync(async (req, res) => {
    res.render("listings/add.ejs");
  }),
);

app.post(
  "/listings/add",
  wrapAsync(async (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
      console.log("JOI ERROR:", error.details[0].message);
      throw new ExpressError(error.details[0].message, 400);
    }
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

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const allList = await listing.findById(id).populate("reviews");
    if (!allList) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { allList });
  }),
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const allList = await listing.findById(id);

    res.render("listings/edit.ejs", { allList });
  }),
);

app.patch(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    await listing.findByIdAndUpdate(
      id,
      { title, description, price, location, country },
      { runValidators: true },
    );
    req.flash("success", "Successfully edited the listing!");
    res.redirect(`/listings/${id}`);
  }),
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  }),
);

app.use("/listings", rList);

//reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    const listingData = await listing.findById(req.params.id);

    const newReview = new review(req.body.review);

    listingData.reviews.push(newReview._id);

    await newReview.save();
    await listingData.save();
    req.flash("success", "Successfully added the review!");
    res.redirect(`/listings/${req.params.id}`);
  }),
);

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
  }),
);

app.use("/listings/:id/reviews", rReview);
app.use("/", rUser);

app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(port, (req, res) => {
  console.log(`successfully using port ${port}`);
});
