const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/users", userController.get_user);
router.post("/signup", userController.signup_user);
router.post("/login", userController.login_user);
router.post("/delete/:userId", userController.delete_user);
