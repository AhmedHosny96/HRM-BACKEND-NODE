const jwt = require("jsonwebtoken");
const config = require("config");

//authorizatuion modules

module.exports = function (req, res, next) {
  // check if header is present in the request
  const token = req.header("x-auth-token"); // req.header
  if (!token) return res.status(401).send("Access Denied : No Token Provided.");

  //check token validity
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.send("Invalid Token.");
  }
};
