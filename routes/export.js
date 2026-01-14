const ExcelJS = require("exceljs");
const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../auth");

const router = express.Router();

router.get("/excel", auth, async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transactions");

  sheet.columns = [
    { header: "Party", key: "party" },
    { header: "Type", key: "type" },
    { header: "Amount", key: "amount" }
  ];

  const tx = await Transaction.find().populate("partyId");
  tx.forEach(t => {
    sheet.addRow({
      party: t.partyId.name,
      type: t.type,
      amount: t.amount
    });
  });

  res.setHeader("Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
