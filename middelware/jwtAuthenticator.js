const jwt = require("jsonwebtoken");
var validator = require("validator");
const inputValidator = require("../middelware/inputValidator");

const maxAge = 3 * 24 * 60 * 60;
module.exports.jwt_token_generator = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRECT, {
    expiresIn: maxAge,
  });
};

module.exports.require_authentication = async (req, res, next) => {
  try {
    const err = await inputValidator.error_validation(
      req,
      res,
      inputValidator.jwt_cookie_validation
    );
    const jwtToken = req.cookies.jwt;
    if (!err) {
      jwt.verify(jwtToken, process.env.JWTSECRECT, (err, decodedToken) => {
        if (err) {
          err = JSON.stringify({
            type: "m",
            statusCode: 401,
            errors: [{ msg: "Invalid token" }],
          });
          throw Error(err);
        } else {
          req.params.userId = decodedToken.id;
          next();
        }
      });
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};
