const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: String,
  openingBalance: { type: Number, default: 0 },
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Party", partySchema);
