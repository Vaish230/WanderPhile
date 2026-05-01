require("dotenv").config();
if (process.env.NODE_ENV !== "production") {
  console.log(process.env.SECRET);
}
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
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isOwner } = require("./middlewares.js");

const store = MongoStore.create({
  mongoUrl: process.env.mong,
  collectionName: "sessions",
});

store.on("error", (err) => {
  console.log("error in mongo store", err);
});

const sessionOption = {
  store,
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
  await mongoose.connect(process.env.mong);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userCheck = req.user;
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

app.use("/listings", rList);

//reviews

app.use("/listings/:id/reviews", rReview);
app.use("/", rUser);

app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 🔥 prevents crash
  }

  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(port, (req, res) => {
  console.log(`successfully using port ${port}`);
});
