const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const USERS = [
  { username: "owner1", password: "owner1@123" },
  { username: "owner2", password: "owner2@123" },
  { username: "admin",  password: "admin@123" }
];

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).send("Invalid credentials");

  const token = jwt.sign({ username }, "SECRET123");
  res.json({ token });
});

module.exports = router;
