const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  action: String, // ADD / UPDATE / DELETE
  module: String, // PARTY / TRANSACTION / EXPENSE
  description: String,
  user: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);
