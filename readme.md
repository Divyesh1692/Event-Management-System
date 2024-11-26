# Event Management System Backend

The **Event Management System** is a backend project that allows users to create, view, and RSVP for events. It also provides features like user authentication, event filtering, and automated notifications for event updates.

---

Vercel Deployment Url : https://event-management-system-three-weld.vercel.app/

You can test all API endpoints in Postman or similar services. All endpoints information is given below. Please go through it.

---

## Features

### User Features

- **Signup/Login/Logout**:

  - Users can sign up, log in, and log out securely using JWT authentication.
  - Endpoints:
    - `POST /user/signup`
    - `POST /user/login`
    - `POST /user/logout`

- **RSVP for Events**:

  - Users can RSVP for events.
  - If the event is full, their status is marked as _Rejected_.
  - If there’s availability, their status is marked as _Confirmed_.
  - Endpoint:
    - `POST /event/rsvp/:eventId`

- **View RSVP Status**:
  - Users can see their RSVP status (e.g., _Confirmed_, _Upcoming_, or _Completed Events_).
  - Endpoint:
    - `GET /user/events`

### Event Management Features

- **Create Events**:

  - Users can create events by providing details like title, description, date, location, and max attendees.
  - Image uploads are handled using **Cloudinary**.
  - Endpoint:
    - `POST /event/create`

- **View Events**:

  - Users can view all events or filter and search events.
  - Filters include `date`, `city`, and `eventType`.
  - Search supports case-insensitive queries across event titles, descriptions, and locations.
  - Endpoints:
    - `GET /event/allevents`
    - `GET /event/event/:id`
    - `GET /event/filter`

- **Edit/Delete Events**:
  - Event creators can edit or delete their events.
  - Endpoints:
    - `PATCH /event/update/:id`
    - `DELETE /event/delete/:id`

### Notifications

- **Email Notifications**:

  - Sends email updates when:
    - Users successfully RSVP for an event (_Confirmed_ status).
    - Events they RSVP’d to are updated.
    - Events they RSVP’d to are approaching.

- **Automated Notifications**:
  - Uses **Node-Cron** to send reminders for upcoming events.

---

## API Endpoints

### User Routes (`/user`)

| Method | Endpoint  | Description                |
| ------ | --------- | -------------------------- |
| POST   | `/signup` | User signup                |
| POST   | `/login`  | User login                 |
| POST   | `/logout` | User logout                |
| GET    | `/events` | View RSVP status of events |

### Event Routes (`/event`)

| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/allevents`     | Get all events                    |
| GET    | `/event/:id`     | Get details of a specific event   |
| GET    | `/filter`        | Filter events by date, city, etc. |
| POST   | `/create`        | Create a new event                |
| POST   | `/rsvp/:eventId` | RSVP for an event                 |
| PATCH  | `/update/:id`    | Update an existing event          |
| DELETE | `/delete/:id`    | Delete an event                   |

---

## Technology Stack

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Cloudinary** for image uploads
- **Nodemailer** for sending emails
- **Node-Cron** for scheduling notifications

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd event-management-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up `.env` file in the root directory:

   ```env
   PORT=3000
   MONGO_URI=<your_mongo_db_uri>
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloud_name>
   CLOUDINARY_API_KEY=<your_api_key>
   CLOUDINARY_API_SECRET=<your_api_secret>
   EMAIL_USER=<your_email_address>
   EMAIL_PASS=<your_email_password>
   ```

5. Start the server:
   ```bash
   npm start
   ```

---

## Usage

1. **User Signup/Login**:  
   Use the `/user/signup` and `/user/login` endpoints to create and authenticate users.

2. **Create Events**:  
   Use the `/event/create` endpoint to add new events with an image upload.

3. **RSVP**:  
   RSVP for an event using the `/event/rsvp/:eventId` endpoint.

4. **Filter and Search**:  
   Use `/event/filter` with query parameters to filter events by date, city, and type.

5. **Notifications**:  
   Email updates are automated via Nodemailer and Node-Cron.

---
