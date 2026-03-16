const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "Not specified",
  },
  latitude: {
    type: Number,
    default: 28.6139, // Default to Delhi
  },
  longitude: {
    type: Number,
    default: 77.209, // Default to Delhi
  },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
