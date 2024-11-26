const bcryptjs = require("bcryptjs");
const { generateTokenAndSetCookies } = require("../utils/generateToken");
const User = require("../models/userSchema");
const Event = require("../models/eventSchema");

const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const isUser = await User.findOne({ email: email });
    if (isUser) return res.status(409).json({ message: "User already exists" });
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    let user = {
      username,
      email,
      password: hashedPassword,
    };

    let data = await User.create(user);
    generateTokenAndSetCookies(data._id, res);
    res.status(200).json({ message: "User created successfully", data: data });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    let isValid = await bcryptjs.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });
    generateTokenAndSetCookies(user._id, res);
    res
      .status(200)
      .json({ message: "User logged in successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error: error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const userRsvp = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all events where the user has RSVP'd
    const events = await Event.find({ "RSVPs.userId": userId });

    const results = events.map((event) => {
      const userRSVP = event.RSVPs.find(
        (rsvp) => rsvp.userId.toString() === userId.toString()
      );
      const status =
        new Date(event.date) < new Date()
          ? "Completed"
          : userRSVP.status === "Confirmed"
          ? "Upcoming"
          : userRSVP.status; // Maintain Rejected if already set

      return {
        event: {
          title: event.title,
          date: event.date,
          location: event.location,
        },
        rsvpStatus: status,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = { signup, login, logout, userRsvp };
