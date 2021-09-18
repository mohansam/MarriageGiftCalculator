const { body, validationResult, cookie, query } = require("express-validator");
//check for signup input
module.exports.signup_validation = async (req) => {
  [
    await body("UserEmail")
      .exists()
      .withMessage("User Email Field is must")
      .bail()
      .isEmail()
      .withMessage("Not a valid email")
      .run(req),
    await body("UserPwd")
      .exists()
      .withMessage("User Pwd Field is must")
      .bail()
      .isLength({ min: 6, max: 20 })
      .withMessage(
        "password length should be between minimum 6 characters to maximum 20 characters"
      )
      .run(req),
    await body("UserName")
      .exists()
      .withMessage("User Name Field is must")
      .bail()
      .isString()
      .withMessage("Name must be a number")
      .bail()
      .isLength({ min: 3, max: 20 })
      .withMessage(
        "User Name length should be between minimum 3 characters to maximum 20 characters"
      )
      .run(req),
  ];
};

//check for login input
module.exports.login_validation = async (req) => {
  [
    await body("UserEmail")
      .exists()
      .withMessage("User Email Field is must")
      .bail()
      .isEmail()
      .withMessage("Not a valid email")
      .run(req),
    await body("UserPwd")
      .exists()
      .withMessage("User Pwd Field is must")
      .bail()
      .isLength({ min: 6, max: 20 })
      .withMessage(
        "password length should be between minimum 6 characters to maximum 20 characters"
      )
      .run(req),
  ];
};

//json Cookie validation
module.exports.jwt_cookie_validation = async (req) => {
  [
    await cookie("jwt")
      .exists()
      .withMessage("jwt token cookie is must")
      .bail()
      .isJWT()
      .withMessage("not a valid JWT")
      .run(req),
  ];
};

//attendee creation input validation
module.exports.attendee_creation_validation = async (req) => {
  [
    await body("AttendeeName")
      .exists()
      .withMessage("Attendee Name Field is must")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3, max: 20 })
      .withMessage(
        "User Name length should be between minimum 3 characters to maximum 20 characters"
      )
      .run(req),
    await body("AttendeeAmount")
      .exists()
      .withMessage("Attendee amount Field is must")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Attendee amount should be greater than 0")
      .bail()
      .toInt()
      .run(req),
    await body("AttendeeCity")
      .exists()
      .withMessage("Attendee city Field is must")
      .bail()
      .isString()
      .withMessage("Must be a string")
      .isLength({ min: 3, max: 20 })
      .withMessage(
        "City length should be between minimum 3 characters to maximum 20 characters"
      )
      .run(req),
  ];
};

//attendee updation input validation

//delete attendee validation
module.exports.delete_attendee_validation = async (req) => {
  await body("AttendeeId")
    .exists()
    .withMessage("Attendee Id Field is must")
    .bail()
    .isMongoId()
    .withMessage("Id must be a valid Mongo Id")
    .run(req);
};

//update attendee validation
module.exports.update_attendee_validation = async (req) => {
  await this.attendee_creation_validation(req);
  await this.delete_attendee_validation(req);
};

//Search attendee by name Validation
module.exports.search_attendee_name_validation = async (req) => {
  await query("AttendeeName")
    .exists()
    .withMessage("AttendeeName field is must")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage(
      "query Name length should be between minimum 3 characters to maximum 20 characters"
    )
    .run(req);
};

//Search attendee by name Validation
module.exports.search_attendee_city_validation = async (req) => {
  await query("AttendeeCity")
    .exists()
    .withMessage("Attendee city field is must")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage(
      "query Name length should be between minimum 3 characters to maximum 20 characters"
    )
    .run(req);
};
//error validation
module.exports.error_validation = async (req, res, inputValidation) => {
  await inputValidation(req);
  error = validationResult(req);
  if (error.isEmpty()) return false;
  throw Error(
    JSON.stringify({ type: "m", statusCode: 400, errors: error.errors })
  );
};

//error handler
module.exports.error_handler = (err, req, res) => {
  err = err.message;
  //check for unique emiail id
  if (err.includes("E11000"))
    err = JSON.stringify({
      type: "m",
      statusCode: 400,
      errors: [{ msg: "Email id already exists" }],
    });
  //check for JSON paser error
  if (err.includes("Unexpected string in JSON"))
    err = JSON.stringify({
      type: "m",
      statusCode: 400,
      errors: [{ msg: "invalid JSON input" }],
    });
  //check for validation failed error
  if (err.includes("type")) {
    err = JSON.parse(err);
    return res.status(err.statusCode).json(err.errors);
  }
  //to handle server error
  console.log(err);
  res.status(500).json([{ msg: "something broke" }]);
};
