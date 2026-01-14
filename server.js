const express = require("express");
require("./db");
const cors = require("cors");
app.use(cors());

const app = express();
app.use(express.json());

app.use("/login", require("./routes/login"));
app.use("/transaction", require("./routes/transaction"));
app.use("/party", require("./routes/party"));
app.use("/transaction", require("./routes/transaction"));
app.use("/expense", require("./routes/expense"));
app.use("/report", require("./routes/report"));
app.use("/ledger", require("./routes/ledger"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
