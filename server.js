const express = require("express");
const cors = require("cors");
require("./db"); // MongoDB connection

const app = express(); // ✅ app MUST be created first

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/login", require("./routes/login"));
app.use("/party", require("./routes/party"));
app.use("/transaction", require("./routes/transaction"));
app.use("/expense", require("./routes/expense"));
app.use("/report", require("./routes/report"));
app.use("/ledger", require("./routes/ledger"));
// app.use("/history", require("./routes/history")); // if exists

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
