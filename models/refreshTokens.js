const mongoose = require("mongoose");

const refreshTokensSchema = new mongoose.Schema({
  username: { String },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
    expires: "30d", // expires in 30d
  },
});

module.exports = mongoose.model("RefreshTokens", refreshTokensSchema);
