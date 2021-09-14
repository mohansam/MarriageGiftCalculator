const User = require("../models/userModel");
const Attendee = require("../models/attendeeModel");

//get all the users
module.exports.get_user = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//create new user
module.exports.signup_user = async (req, res) => {
  const user = new User({
    UserName: req.body.UserName,
    UserEmail: req.body.UserEmail,
    UserPwd: req.body.UserPwd,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

//user login
module.exports.login_user = async (req, res) => {
  try {
    const user = await User.findOne({ UserEmail: req.body.UserEmail });
    if (user != null) {
      if (req.body.UserPwd == user.UserPwd) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ message: "user id or pwd incorrect" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//deleting one user and attendees related to that users
module.exports.delete_user = async (req, res) => {
  try {
    const deletedUser = await User.deleteMany({ _id: req.params.userId });
    if (deletedUser.deletedCount <= 0)
      return res.status(404).json({ message: "user not found" });
    const deletedAttendee = await Attendee.deleteMany({
      AttendeeUser: req.params.userId,
    });
    res.status(200).json({
      message: `${deletedUser.deletedCount}user deleted and ${deletedAttendee.deletedCount} attendee deleted`,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
