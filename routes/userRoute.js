const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const jwtAuthenticator = require("../middelware/jwtAuthenticator");

//getting all users from DB
router.get("/users", userController.get_user);

//creating new user
//body {UserName,UserEmail,UserPwd}
router.post("/signup", userController.signup_user);

//login
//body {UserEmail,UserPwd}
router.post("/login", userController.login_user);

//deleting user account and data related to attendee
//JWT token is must, user id is populated from JWT token
router.delete(
  "/delete",
  jwtAuthenticator.require_authentication,
  userController.delete_user
);

module.exports = router;
