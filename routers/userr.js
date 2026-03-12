const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

router.get("/register", (req, res) => {
  res.render("listings/register.ejs");
});
router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      let { email, username, password } = req.body;
      const user = new User({ email, username });
      const regUser = await User.register(user, password);
      req.flash("success", "Successfully registered!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  }),
);

router.get("/login", async (req, res) => {
  res.render("listings/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }),
);

module.exports = router;
