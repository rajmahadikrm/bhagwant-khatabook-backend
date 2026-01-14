const express = require("express");
const Transaction = require("../models/Transaction");
const Expense = require("../models/Expense");
const auth = require("../auth");

const router = express.Router();

router.get("/profit-loss", auth, async (req, res) => {
  const sales = await Transaction.aggregate([
    { $match: { type: "SELL" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const purchases = await Transaction.aggregate([
    { $match: { type: "BUY" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const expenses = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.json({
    sales: sales[0]?.total || 0,
    purchases: purchases[0]?.total || 0,
    expenses: expenses[0]?.total || 0,
    profit:
      (sales[0]?.total || 0) -
      (purchases[0]?.total || 0) -
      (expenses[0]?.total || 0)
  });
});

module.exports = router;
