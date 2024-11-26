const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

require("dotenv").config();

const validator = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    // console.log("Access denied" + req.cookies.token);
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded" + decoded.toString());

    req.user = await User.findById(decoded.userId).select("-password");
    // console.log("Authent" + req.user);
    next();
  } catch (error) {
    res.status(403).json({ message: "Access Forbidden" });
  }
};

module.exports = validator;
