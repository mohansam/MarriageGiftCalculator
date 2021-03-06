const express = require("express");
const router = express.Router();
const attendeeController = require("../controller/attendeeController");

// Getting all attendee
router.get(
  "/:userId",
  attendeeController.verify_user_id,
  attendeeController.get_all_attendee
);

// Creating new attendee
router.post(
  "/:userId",
  attendeeController.verify_user_id,
  attendeeController.create_new_attendee
);

// Updating One attendee
router.patch(
  "/:userId",
  attendeeController.verify_user_id,
  attendeeController.get_one_attendee,
  attendeeController.update_one_attendee
);

// Deleting one attendee
router.delete(
  "/:userId",
  attendeeController.verify_user_id,
  attendeeController.delete_one_attendee
);

module.exports = router;
