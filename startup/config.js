const config = require("config");
// checks if jwtprivatekey is defined
module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR : jwtPrivateKey is not defined");
    //exit the process
    process.exit;
  }
};
