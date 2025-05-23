const mongoose = require('mongoose');


const TokenSchema = new mongoose.Schema({
  refreshToken: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.TOKEN_TTL_EXPIRES_IN || 1000 * 60 * 60 * 24 * 30,
  },
});

module.exports = mongoose.model("Token", TokenSchema);
