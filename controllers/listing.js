const listing = require("../models/listing.js");
const flash = require("connect-flash");

module.exports.mainPage = async (req, res) => {
  const allList = await listing.find({});
  res.render("listings/home.ejs", { allList });
};

module.exports.addListingPage = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  res.render("listings/add.ejs");
};

module.exports.getID = async (req, res) => {
  const { id } = req.params;
  const allList = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  res.render("listings/show.ejs", { allList });
  console.log(allList);
  console.log(allList.reviews);
};

module.exports.postListing = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  const url = req.file.path;
  const filename = req.file.filename;
  const { title, description, price, location, country, category } =
    req.body.listing;
  let newList = new listing({
    title,
    description,
    price,
    location,
    country,
    category,
  });
  newList.owner = req.user._id;
  newList.image = { url, filename };
  await newList.save();
  req.flash("success", "Successfully added a new listing!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }

  const { id } = req.params;

  const { title, description, price, location, country, category } =
    req.body.listing;

  let updatedData = {
    title,
    description,
    price,
    location,
    country,
    category,
  };

  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.findByIdAndUpdate(id, updatedData, {
    runValidators: true,
    new: true,
  });

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.getIDtoEdit = async (req, res) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  const allList = await listing.findById(id);
  res.render("listings/edit.ejs", { allList });
};

module.exports.deleteListing = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
};

module.exports.getCategory = async (req, res) => {
  const { category } = req.params;
  const allList = await listing.find({
    category: new RegExp(`^${category}$`, "i"),
  });

  res.render("listings/home.ejs", { allList });
};

module.exports.searchListings = async (req, res) => {
  const qu = req.query.q;
  if (!qu || qu.trim() === "") {
    req.flash("error", "Please enter a search query!");
    return res.redirect("/listings");
  }
  const allList = await listing.find({
    $or: [
      { title: new RegExp(`${qu}`, "i") },
      { category: new RegExp(`${qu}`, "i") },
      { country: new RegExp(`${qu}`, "i") },
      { location: new RegExp(`${qu}`, "i") },
    ],
  });
  if (allList.length === 0) {
    req.flash("error", "No matching listings found!");
    return res.redirect("/listings");
  }
  res.render("listings/home.ejs", { allList });
};
