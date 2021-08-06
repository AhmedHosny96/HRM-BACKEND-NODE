const jwt = require("jsonwebtoken");
const config = require("config");

//authorizatuion modules

module.exports = function (req, res, next) {
  // if (!config.get("requiresAuth")) return next();
  // check if header is present in the request
  const token = req.header("x-auth-token"); //  response =>
  if (!token) res.status(401).send("Access Denied : No Token Provided.");

  //check token validity
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token.");
  }
};
