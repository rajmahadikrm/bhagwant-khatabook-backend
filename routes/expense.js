const express = require("express");
const Expense = require("../models/Expense");
const History = require("../models/History");
const auth = require("../auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const exp = new Expense({ ...req.body, createdBy: req.user.username });
  await exp.save();

  await History.create({
    action: "ADD",
    module: "EXPENSE",
    description: `${exp.type} expense`,
    user: req.user.username
  });

  res.json(exp);
});

router.get("/", auth, async (req, res) => {
  res.json(await Expense.find());
});

module.exports = router;
