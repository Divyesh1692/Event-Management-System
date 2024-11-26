const { Router } = require("express");
const {
  signup,
  login,
  logout,
  userRsvp,
} = require("../controllers/usersController");
const validator = require("../middlewares/auth");

const userRouter = Router();

userRouter.get("/events", validator, userRsvp);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

module.exports = userRouter;
