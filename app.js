const express = require("express");
const app = express();

const sms = require("./sms/index");

const port = process.env.PORT || 3000;

app.use("/api/v1/send/sms", sms);

app.get("/status", (req, res) => {
  res.json({ status: "Ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
