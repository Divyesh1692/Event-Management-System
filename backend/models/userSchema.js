const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rsvps: [
    {
      events: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      status: {
        type: String,
        enum: ["rejected", "confirmed"],
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
