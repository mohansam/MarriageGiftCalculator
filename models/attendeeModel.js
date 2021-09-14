const mongoose = require("mongoose");

const AttendeeSchema = new mongoose.Schema(
  {
    AttendeeName: {
      type: String,
      required: true,
    },
    AttendeeAmount: {
      type: Number,
      required: true,
    },
    AttendeeCity: {
      type: String,
      required: true,
    },
    AttendeeUser: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("attendee", AttendeeSchema);
