const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
module.exports.jwt_token_generator = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRECT, {
    expiresIn: maxAge,
  });
};

module.exports.require_authentication = (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  if (jwtToken) {
    jwt.verify(jwtToken, process.env.JWTSECRECT, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "invalid token" });
      } else {
        req.params.userId = decodedToken.id;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: " not a valid JWT" });
  }
};
