const jwt = require("jsonwebtoken");

require("dotenv").config();

const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, { expires: new Date(Date.now() + 86400000) });
  return token;
};

module.exports = { generateTokenAndSetCookies };
