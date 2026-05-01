const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const controllingu = require("../controllers/user.js");

router.get("/register", controllingu.registerPage);

router.post("/register", wrapAsync(controllingu.registerUser));

router.get("/login", controllingu.loginPage);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(controllingu.loginUser),
);

router.get("/logout", controllingu.logoutUser);

module.exports = router;
