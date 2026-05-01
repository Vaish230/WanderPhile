const mongoose = require("mongoose");
const review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "Trending",
      "Beach",
      "Mountains",
      "Farm",
      "Castle",
      "Beach",
      "Space",
      "Snow",
      "Ferry",
      "City",
      "Dome",
    ],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const List = mongoose.model("List", listingSchema);

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

module.exports = List;
