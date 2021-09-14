const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
module.exports.jwt_token_generator = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRECT, {
    expiresIn: maxAge,
  });
};
