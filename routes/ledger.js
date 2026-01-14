const express = require("express");
const Party = require("../models/Party");
const Transaction = require("../models/Transaction");
const auth = require("../auth");

const router = express.Router();

router.get("/:partyId", auth, async (req, res) => {
  const party = await Party.findById(req.params.partyId);
  const tx = await Transaction.find({ partyId: party._id });

  let balance = party.openingBalance || 0;

  tx.forEach(t => {
    if (t.type === "SELL") balance += t.amount;
    if (t.type === "BUY") balance -= t.amount;
  });

  res.json({
    party: party.name,
    openingBalance: party.openingBalance,
    transactions: tx,
    balance
  });
});

module.exports = router;
