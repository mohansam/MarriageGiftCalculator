const express = require("express");
const router = express.Router();
const attendeeController = require("../controller/attendeeController");
const jwtAuthenticator = require("../middelware/jwtAuthenticator");

// Getting all attendee
//JWT token is must, user id is populated from JWT token
router.get(
  "/getattendee",
  jwtAuthenticator.require_authentication,
  attendeeController.get_all_attendee
);

// Creating new attendee
//JWT token is must, user id is populated from JWT token
//body: {AttendeeName,AttendeeAmount,AttendeeCity}
router.post(
  "/createattendee",
  jwtAuthenticator.require_authentication,
  attendeeController.create_new_attendee
);

// Updating One attendee
//JWT token is must, user id is populated from JWT token
//body: {AttendeeName,AttendeeAmount,AttendeeCity,AttendeeId}
router.patch(
  "/updateattendee",
  jwtAuthenticator.require_authentication,
  attendeeController.get_one_attendee,
  attendeeController.update_one_attendee
);

// Deleting one attendee
//JWT token is must, user id is populated from JWT token
//body{AttendeeId}
router.delete(
  "/deleteattendee",
  jwtAuthenticator.require_authentication,
  attendeeController.delete_one_attendee
);

//// sum total amount
//JWT token is must, user id is populated from JWT token
router.get(
  "/totalamount",
  jwtAuthenticator.require_authentication,
  attendeeController.user_total_amount
);
// serach attendde by name
//JWT token is must, user id is populated from JWT token
router.get(
  "/searchattendeename",
  jwtAuthenticator.require_authentication,
  attendeeController.search_attendee_name
);

// serach attendde by city
//JWT token is must, user id is populated from JWT token
router.get(
  "/searchattendeecity",
  jwtAuthenticator.require_authentication,
  attendeeController.search_attendee_city
);

module.exports = router;
