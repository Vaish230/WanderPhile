const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => console.log("MONGODB WORKING"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wander");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((item) => ({
    ...item,
    owner: "69b9bf6e2780b40d5aa9ca51",
  }));
  await Listing.insertMany(initdata.data);
};

initDB();
