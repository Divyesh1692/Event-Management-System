const Event = require("../models/eventSchema");
const { countDocuments } = require("../models/userSchema");
const { sendEmail } = require("../utils/emailService");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      addressLine1,
      city,
      state,
      country,
      pincode,
      maxAttendees,
      eventType,
    } = req.body;
    const image = req.file.path;
    // console.log(image);

    const user = req.user;
    // console.log(user);
    let location = {
      addressLine1: addressLine1,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
    };
    console.log(location);
    const event = {
      title,
      description,
      date,
      eventType,
      location,
      maxAttendees,
      image,
      createdBy: user.id,
    };

    let data = await Event.create(event);
    res
      .status(201)
      .send({ message: "event created successfully", event: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error creating event!!!", error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).send({ events });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error fetching events!!!", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "event not found!!!" });
    res.status(200).send({ event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error fetching event!!!", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "event not found!!!" });
    if (event.createdBy == req.user.id) {
      const { title, description, date, location, maxAttendees, eventType } =
        req.body;
      const image = req.file ? req.file.path : event.image;
      updatedEvent = {
        title,
        description,
        date,
        image,
        maxAttendees,
        eventType,
        location,
      };
      let data = await Event.findByIdAndUpdate(event.id, updatedEvent, {
        new: true,
      });

      for (const attendee of event.attendees) {
        const user = await User.findById(attendee.user);
        if (user) {
          await sendEmail(
            user.email,
            `Event Update: "${event.title}"`,
            `<p>Hello ${user.username},</p>
             <p>The event "${event.title}" you RSVP'd for has been updated:</p>
             <ul>
               <li>Title: ${event.title}</li>
               <li>Date: ${event.date}</li>
               <li>Location: ${event.location.city}, ${event.location.state}</li>
             </ul>
             <p>Thank you for staying with us!</p>`
          );
        }
      }

      return res
        .status(200)
        .json({ message: "event updated", updated_event: data });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this event!!!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "error updating event!!!", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "event not found!!!" });
    if (event.createdBy == req.user.id) {
      await Event.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "event deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this event!!!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "error deleting event!!!", error: error.message });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const user = req.user;
    const { eventId } = req.params;
    const userId = req.user._id; // Get the logged-in user's ID

    // Fetch the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already RSVP'd
    const existingRSVP = event.RSVPs.find(
      (rsvp) => rsvp.userId.toString() == userId.toString()
    );
    if (existingRSVP) {
      return res
        .status(400)
        .json({ message: "You have already RSVP'd for this event." });
    }

    // Check if event is full
    const confirmedRSVPs = event.RSVPs.filter(
      (rsvp) => rsvp.status == "Confirmed"
    ).length;
    const rsvpStatus =
      confirmedRSVPs >= event.maxAttendees ? "Rejected" : "Confirmed";

    // Add RSVP
    if (rsvpStatus == "Confirmed") {
      event.RSVPs.push({
        userId,
        status: rsvpStatus,
      });

      await event.save();

      // Send RSVP confirmation email
      const emailMessage = `
         Hi ${user.username},
         Your RSVP for the event "${event.title}" has been ${rsvpStatus}.
         Event Details:
         - Date: ${event.date}
         - Location: ${event.location.addressLine1},${event.location.city}, ${event.location.state},${event.location.pincode}
       `;
      await sendEmail(user.email, "Event RSVP Status", emailMessage);

      res.status(200).json({ message: "RSVP Confirmed", rsvpStatus });
    }

    // Send email to the user
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const filterEvents = async (req, res) => {
  const { date, city, eventType, search } = req.query;

  try {
    // Build the query object dynamically
    const query = {};

    // Filter by date (exact match or greater for upcoming events)
    if (date) {
      query.date = { $gte: new Date(date) }; // Get events on or after the given date
    }

    // Filter by city (case-insensitive)
    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    // Filter by event type (case-insensitive)
    if (eventType) {
      query.eventType = { $regex: eventType, $options: "i" };
    }

    // Search across title, description, and location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.addressLine1": { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }

    // Fetch filtered events
    const events = await Event.find(query);

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
    });
  }
};

module.exports = {
  createEvent,
  rsvpEvent,
  deleteEvent,
  updateEvent,
  getEvents,
  getEventById,
  filterEvents,
};
