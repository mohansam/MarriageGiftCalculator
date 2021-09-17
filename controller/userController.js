const User = require("../models/userModel");
const Attendee = require("../models/attendeeModel");
const jwtAuthenticator = require("../middelware/jwtAuthenticator");
const inputValidator = require("../middelware/inputValidator");

const maxAge = 3 * 24 * 60 * 60;
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
  try {
    const err = await inputValidator.error_validation(req, res);
    if (!err) {
      const user = new User({
        UserName: req.body.UserName,
        UserEmail: req.body.UserEmail,
        UserPwd: req.body.UserPwd,
      });
      const newUser = await user.save();
      const jwtToken = jwtAuthenticator.jwt_token_generator(newUser._id);
      res.cookie("jwt", jwtToken, { httpOnly: true, maxAge: maxAge * 1000 });
      res.cookie("loggedinstatus", "true", { maxAge: maxAge * 1000 });
      res.status(201).json({
        UserName: newUser.UserName,
        UserEmail: newUser.UserEmail,
      });
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

//user login
module.exports.login_user = async (req, res) => {
  try {
    const err = await inputValidator.error_validation(req, res);
    if (!err) {
      const user = await User.login(req.body.UserEmail, req.body.UserPwd);
      const jwtToken = jwtAuthenticator.jwt_token_generator(user._id);
      res.cookie("jwt", jwtToken, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.cookie("loggedinstatus", "true", { maxAge: maxAge * 1000 });
      res.status(200).json({
        UserName: user.UserName,
        UserEmail: user.UserEmail,
      });
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
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

//logout user
module.exports.logout_user = async (req, res) => {
  res.cookie("jwt", " ", { maxAge: 1 });
  res.cookie("loggedinstatus", "true", { maxAge: 1 });
  res.status(200).json({ message: "looged out" });
};
