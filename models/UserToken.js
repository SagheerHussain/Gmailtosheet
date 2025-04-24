const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  refresh_token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserToken", userTokenSchema);
