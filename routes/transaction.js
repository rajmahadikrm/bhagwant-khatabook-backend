const express = require("express");
const Transaction = require("../models/Transaction");
const History = require("../models/History");
const auth = require("../auth");

const router = express.Router();

/* =====================================================
   ADD BUY / SELL TRANSACTION
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const { partyId, type, quantity, rate } = req.body;

    if (!partyId || !type || !quantity || !rate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const amount = quantity * rate;

    const transaction = new Transaction({
      partyId,
      type,
      quantity,
      rate,
      amount,
      createdBy: req.user.username
    });

    await transaction.save();

    // 🔹 Save history (audit log)
    await History.create({
      action: "ADD",
      module: "TRANSACTION",
      description: `${type} transaction added (Amount: ₹${amount})`,
      user: req.user.username
    });

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET ALL TRANSACTIONS
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("partyId")
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ADD PAYMENT (PAID / PARTIAL)
===================================================== */
router.put("/:id/pay", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.paymentReceived += amount;

    if (transaction.paymentReceived >= transaction.amount) {
      transaction.paymentStatus = "PAID";
    } else if (transaction.paymentReceived > 0) {
      transaction.paymentStatus = "PARTIAL";
    }

    await transaction.save();

    // 🔹 Save history
    await History.create({
      action: "UPDATE",
      module: "TRANSACTION",
      description: `Payment received ₹${amount} (Status: ${transaction.paymentStatus})`,
      user: req.user.username
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE TRANSACTION
===================================================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    const tx = await Transaction.findByIdAndDelete(req.params.id);

    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await History.create({
      action: "DELETE",
      module: "TRANSACTION",
      description: `Transaction deleted (Amount: ₹${tx.amount})`,
      user: req.user.username
    });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
