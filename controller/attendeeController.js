const User = require("../models/userModel");
const Attendee = require("../models/attendeeModel");

//verifying userid
module.exports.verify_user_id = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message2: err });
  }
  next();
};

//getting one attendee
module.exports.get_one_attendee = async (req, res, next) => {
  let attendee;
  try {
    attendee = await Attendee.findById(req.body.AttendeeId);
    if (attendee == null) {
      return res.status(404).json({ message: "Cannot find attendee" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.attendee = attendee;
  next();
};

// Getting all the attendee
module.exports.get_all_attendee = async (req, res) => {
  try {
    const attendee = await Attendee.find({ AttendeeUser: req.params.userId });
    res.status(200).json(attendee);
  } catch (err) {
    res.status(500).json({ message1: err });
  }
};

//Creating new attendee
module.exports.create_new_attendee = async (req, res) => {
  const attendee = new Attendee({
    AttendeeName: req.body.AttendeeName,
    AttendeeAmount: req.body.AttendeeAmount,
    AttendeeCity: req.body.AttendeeCity,
    AttendeeUser: req.params.userId,
  });
  try {
    const newAttendee = await attendee.save();
    res.status(201).json(newAttendee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Updating one attendee
module.exports.update_one_attendee = async (req, res) => {
  res.attendee.AttendeeName = req.body.AttendeeName;
  res.attendee.AttendeeAmount = req.body.AttendeeAmount;
  res.attendee.AttendeeCity = req.body.AttendeeCity;
  try {
    const updateUser = await res.attendee.save();
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//deleting one user and attendees related to that users
//this just example
module.exports.delete_one_attendee = async (req, res) => {
  try {
    const { deletedCount } = await Attendee.deleteMany({
      _id: req.body.AttendeeId,
    });
    if (deletedCount <= 0)
      return res.status(404).json({ message: "attendee not found" });
    res.status(200).json({ message: `${deletedCount} attendee deleted` });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
