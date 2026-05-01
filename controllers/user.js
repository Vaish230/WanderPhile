const User = require("../models/user.js");

module.exports.registerPage = (req, res) => {
  res.render("listings/register.ejs");
};

module.exports.registerUser = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const user = new User({ email, username });
    const regUser = await User.register(user, password);
    req.login(regUser, (e) => {
      if (e) {
        return next(e);
      }
      req.flash("success", "Welcome to Wander!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginPage = async (req, res) => {
  res.render("listings/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect("/listings");
};

module.exports.logoutUser = (req, res) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
