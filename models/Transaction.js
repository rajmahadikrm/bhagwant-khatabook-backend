const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true
  },

  type: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  rate: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentReceived: {
    type: Number,
    default: 0
  },

  paymentStatus: {
    type: String,
    enum: ["PAID", "PARTIAL", "UNPAID"],
    default: "UNPAID"
  },

  createdBy: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
