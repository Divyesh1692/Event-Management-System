const { Router } = require("express");
const {
  createEvent,
  rsvpEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  filterEvents,
} = require("../controllers/eventController");
const upload = require("../config/multer");
const validator = require("../middlewares/auth");

const eventRouter = Router();

eventRouter.get("/allevents", getEvents);
eventRouter.get("/event/:id", getEventById);
eventRouter.get("/filter", filterEvents);
eventRouter.post("/create", validator, upload.single("image"), createEvent);
eventRouter.post("/rsvp/:eventId", validator, rsvpEvent);
eventRouter.patch("/update/:id", validator, updateEvent);
eventRouter.delete("/delete/:id", validator, deleteEvent);

module.exports = eventRouter;
