const { body, validationResult } = require("express-validator");
//check for signup input
module.exports.signup_validation = [
  body("UserEmail", "Not a valid Email").isEmail(),
  body("UserPwd")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "password length should be between minimum 6 characters to maximum 20 characters"
    ),
];

//check for login input
module.exports.login_validation = [
  body("UserEmail", "Not a valid Email").isEmail(),
  body("UserPwd")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "password length should be between minimum 6 characters to maximum 20 characters"
    ),
];

//error validation
module.exports.error_validation = async (req, res) => {
  error = validationResult(req);
  if (error.isEmpty()) return false;
  throw Error(JSON.stringify({ type: "m", errors: error.errors }));
};

//error handler
module.exports.error_handler = (err, req, res) => {
  err = err.message;
  //check for unique emiail id
  if (err.includes("E11000"))
    err = JSON.stringify({
      type: "m",
      errors: [{ msg: "Email id already exists" }],
    });
  //check for validation failed error
  if (err.includes("type")) {
    err = JSON.parse(err);
    return res.status(400).json(err.errors);
  }
  //to handle server error
  res.status(500).json(err);
};
