const express = require("express");
const Party = require("../models/Party");
const History = require("../models/History");
const auth = require("../auth");

const router = express.Router();

/* Add Party */
router.post("/", auth, async (req, res) => {
  const party = new Party({
    ...req.body,
    createdBy: req.user.username
  });

  await party.save();

  await History.create({
    action: "ADD",
    module: "PARTY",
    description: `Party added: ${party.name}`,
    user: req.user.username
  });

  res.json(party);
});

/* Get All Parties */
router.get("/", auth, async (req, res) => {
  const parties = await Party.find().sort({ createdAt: -1 });
  res.json(parties);
});

module.exports = router;
