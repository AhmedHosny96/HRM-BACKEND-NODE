const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    req: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expired: 3600,
  },
});

const Token = mongoose.model("token", tokenSchema);

module.exports.Token = Token;
