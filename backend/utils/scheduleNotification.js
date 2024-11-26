const cron = require("node-cron");
const Event = require("../models/eventSchema");
const { sendEmail } = require("./emailService");




const setupEventNotifications = () => {

  cron.schedule("0 7 * * *", async () => {
    console.log("Running scheduled job for upcoming event notifications...");
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    try {
      const upcomingEvents = await Event.find({
        date: { $gte: now, $lt: tomorrow },
      }).populate("attendees.user", "email username");

      for (const event of upcomingEvents) {
        for (const attendee of event.attendees) {
          if (attendee.status === "confirmed") {
            const emailMessage = `
              Hi ${attendee.user.username},
              Reminder: The event "${event.title}" is happening soon!
              Event Details:
              - Date: ${event.date}
              - Location: ${event.location.city}, ${event.location.state}
            `;
            await sendEmail(
              attendee.user.email,
              "Upcoming Event Reminder",
              emailMessage
            );
          }
        }
      }
    } catch (err) {
      console.error(`Error sending notifications: ${err.message}`);
    }
  });
};

module.exports = setupEventNotifications;
