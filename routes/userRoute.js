const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const jwtAuthenticator = require("../middelware/jwtAuthenticator");
const inputValidator = require("../middelware/inputValidator");

//getting all users from DB
router.get("/users", userController.get_user);

//creating new user
//body {UserName,UserEmail,UserPwd}
router.post(
  "/signup",
  inputValidator.signup_validation,
  userController.signup_user
);

//login
//body {UserEmail,UserPwd}
router.post(
  "/login",
  inputValidator.login_validation,
  userController.login_user
);

//deleting user account and data related to attendee
//JWT token is must, user id is populated from JWT token
router.delete(
  "/deleteuser",
  jwtAuthenticator.require_authentication,
  userController.delete_user
);

//looging out user account and data related to attendee
//JWT token is must, user id is populated from JWT token
router.get(
  "/logout",
  jwtAuthenticator.require_authentication,
  userController.logout_user
);
module.exports = router;
